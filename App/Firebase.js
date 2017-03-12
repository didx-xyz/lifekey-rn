/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import Session from './Session'
import Storage from './Storage'
import Config from './Config'
import PushNotifications from './PushNotifications'
import Logger from './Logger'
// A higher lever wrapper around PushNotifications
export default class Firebase {

  static updateToken(token) {
    return Storage.store(Config.storage.dbKey, {
      firebaseToken: token
    })
    .then(() => {
      Logger.firebase(`Token updated: ${token}`)
      Session.update({ firebaseToken: token })
      Promise.resolve()
    })
  }

  static getToken() {
    return PushNotifications.getToken()
    .then(tokenFromPN => {
      if (tokenFromPN) {
        Session.update({ firebaseToken: tokenFromPN })
        return Promise.resolve(tokenFromPN)
      } else {
        const tokenFromSession = Session.getState().firebaseToken
        if (tokenFromSession) {
          return Promise.resolve(tokenFromSession)
        } else {
          return Storage.load(Config.storage.dbKey)
        }
      }
    })
    .then(storage => {
      if (storage.firebaseToken) {
        return Promise.resolve(storage.firebaseToken)
      } else {
        return Promise.reject('No firebase token available')
      }
    })
  }
}
