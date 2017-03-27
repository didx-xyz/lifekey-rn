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
    return Storage.store(Config.storage.dbKey, {
      firebaseToken: token
    })

    // update volatile storage
    .then(() => {
      Logger.firebase(`Token updated in Storage: ${token}`)
      const update = {}[ConsentUser.storageKey] = { firebaseToken: token }
      Session.update(update)
      Logger.firebase(`Token updated in Session: ${token}`)
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
        Logger.firebase('Loading token from PushNotification ' + tokenFromPN)
        return Promise.resolve(tokenFromPN)
      } else {
        Logger.firebase('No token available from PushNotifications')
        // Check session
        const userState = Session.getState().user
        try {
          Logger.firebase('Loading token from Session ' + userState.firebaseToken)
          return Promise.resolve(userState.firebaseToken)
        } catch (error) {
          // Check storage last
          return Storage.load(Config.storage.dbKey)
        }
      }
    })
    .then(storageData => {
      // The token in storage is reolved
      try {
        Logger.firebase('Loaded token from Storage ' + storageData.user.firebaseToken)
        return Promise.resolve(storageData.user.firebaseToken)
      } catch (error) {
        Logger.firebase('No token available')
        return Promise.reject('No token available')
      }
    })
  }
}
