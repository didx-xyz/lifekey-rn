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

    const userState = ConsentUser.get()
    let toSign

    // Update persistent storage
    return Storage.store(Config.storage.dbKey, {
      firebaseToken: token
    })

    // update volatile storage
    .then(() => {
      Logger.firebase(`Token updated: ${token}`)
      const update = {}[ConsentUser.storageKey] = { firebaseToken: token }
      Session.update(update)
      if (userState.password) {
        return Crypto.loadKeyStore(Config.keystore.name, userState.password)
      } else {
        return Promise.reject('Not registered. Cannot notify server of token update.')
      }
    })

    // Secure random
    .then(name => Crypto.secureRandom())

    // sign
    .then(randomBytes => {
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

    // First check Java env
    return PushNotifications.getToken()

    .then(tokenFromPN => {
      if (tokenFromPN) {
        // Resolve if exists
        return Promise.resolve(tokenFromPN)
      } else {
        // Check session
        const userState = Session.getState().user
        if (userState && userState.firebaseToken) {
          return Promise.resolve(userState.firebaseToken)
        } else {
          // Storage is last chance
          return Storage.load(Config.storage.dbKey)
        }
      }
    })
    .then(storageData => {
      // The token in storage is reolved
      Promise.resolve(storageData.user.firebaseToken)
    })
  }
}
