/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Config from './Config'
import Storage from './Storage'
import Logger from './Logger'

/**
 * A static class to store and retrieve a global state
 */
export default class Session {

  static state = {}
  /**
   * Return an Object representing the current state
   * @returns {Object} data The current state held in the store
   */
  static getState() {
    return this.state
  }

  /**
   * Update the current state
   * @param {Object} data Data to modify or put into the store
   * @returns {undefined}
   * @throws {string} Update only accepts objects
   */
  static update(data) {
    if (typeof data === 'object') {
      this.state = Object.assign(this.state, data)
    } else {
      throw 'Update only accepts objects'
    }
  }

  static persist() {
    return Storage.store(Config.session.dbKey, this.state)
    .catch(error => {
      Logger.error(error, 'Session')
    })
  }

  static rehydrate() {
    return Storage.load(Config.session.dbKey)
  }

}
