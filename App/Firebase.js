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

// A higher lever wrapper around PushNotifications
export default class Firebase {

  static getToken() {
    return PushNotifications.getToken()
    .then(tokenFromPN => {
      if (tokenFromPN) {
        Session.update({ firebaseToken: tokenFromPN })
        return Promise.all([tokenFromPN])
      } else {
        const tokenFromSession = Session.getState().firebaseToken
        if (tokenFromSession) {
          return Promise.all([tokenFromSession])
        } else {
          return Promise.all([null, Storage.load(Config.storage.dbKey)])
        }
      }
    })
    .then((value) => {
      const [token, appStorage] = value
      if (token) {
        return Promise.resolve(token)
      } else if (appStorage) {
        if (appStorage.firebaseToken) {
          return Promise.resolve(appStorage.firebaseToken)
        } else {
          Promise.reject("No firebase token available")
        }
      } else {
        return Promise.reject("No firebase token available")
      }
    })
  }
}
