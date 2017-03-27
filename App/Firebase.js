/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import { Platform } from 'react-native'
import Session from './Session'
import Storage from './Storage'
import Crypto from './Crypto'
import Config from './Config'
import PushNotifications from './PushNotifications'
import Logger from './Logger'
import Api from './Api'
import ConsentUser from './Models/ConsentUser'

// A higher lever wrapper around PushNotifications
export default class Firebase {

  static updateToken(token) {
    Logger.firebase(`Updating token: ${token}`)
    const userState = ConsentUser.get()
    let toSign

    // Update persistent storage
    const update = {}
    update[ConsentUser.storageKey] = { firebaseToken: token }

    return Storage.store(Config.storage.dbKey, update)

    // update volatile storage
    .then(() => {
      Logger.firebase(`Token updated in Storage: ${token}`)
      const update = {}[ConsentUser.storageKey] = { firebaseToken: token }
      Session.update(update)
      Logger.firebase(`Token updated in Session: ${token}`)
      if (userState.password) {
        return Crypto.loadKeyStore(Config.keystore.name, userState.password)
      } else {
        return Promise.reject('Not registered. Cannot notify server of token')
      }
    })

    // Secure random
    .then(name => Crypto.secureRandom())

    // sign
    .then(randomBytes => {
      Logger.firebase('Signing........')
      toSign = randomBytes
      return Crypto.sign(
        toSign,
        Config.keystore.privateKeyName,
        userState.password,
        Crypto.SIG_SHA256_WITH_RSA
      )
    })

    // Send to server
    .then(signature => {
      Logger.firebase('Sending to server........')
      return Api.device({
        user_id: userState.user_id,
        plain: toSign,
        signature: signature,
        device_id: token,
        device_platform: `${Config.APP_NAME} ${Platform.OS} v${Config.version}`
      })
    })
  }

  static getToken() {
    return new Promise((resolve, reject) => {
      const userState = Session.getState().user
      if (!userState) {
        Storage.load(Config.storage.dbKey)
        .then(data => {
          if (!data) {
            reject('Storage was empty')
          }
          if (!data.user) {
            reject('No user object in storage')
          }
          if (!data.user.firebaseToken) {
            reject('No firebase token in storage')
          } else {
            resolve(data.user.firebaseToken)
          }
        })
      } else {
        if (userState.firebaseToken) {
          Logger.firebase('Got token from state')
          resolve(userState.firebaseToken)
        }
      }
    })
  }
}
