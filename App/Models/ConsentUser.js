/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Session from '../Session'
import Logger from '../Logger'
import Config from '../Config'
import ConsentKeystore from './ConsentKeystore'

export default class ConsentUser {

  static login(password) {
    Session.update({ user: { loggedIn: true } })
  }

  static logout() {
    Session.update({ user: { loggedIn: false } })
  }

  static register(username, email, publicKey) {
    Session.update({ user: { registered: true } })
  }

  static isLoggedIn() {
    return Session.getState().user.loggedIn
  }

  static isRegistered() {
    return new Promise((resolve, reject) => {
      return ConsentKeystore.exists()
      .then(exists => {
        if(exists) {
          Logger.info(`Keystore "${Config.keyStoreName}" found. User not registered.`, this.filename)
          Session.update({ user: { registered: true } })
          resolve(true)
        } else {
          Logger.info(`Keystore "${Config.keyStoreName}" not found. User not registered.`, this.filename)
          Session.update({ user: { registered: false } })
          resolve(false)
        }
      })
      .catch(error => reject(error))
    })
  }
}
