/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
/* eslint-disable no-var */

import Logger from './Logger'
import deepmerge from 'deepmerge'

// Hold's the current session state
var state = {}

/**
 * A static class to store and retrieve a global state
 */
export default class Session {

  /**
   * Return an Object representing the current state
   * @returns {Object} data The current state held in the store
   */
  static getState() {
    return state
  }

  /**
   * Update the current state
   * @param {Object} data Data to modify or put into the store
   * @returns {undefined}
   * @throws {string} Update only accepts objects
   */
  static update(data) {
    if (typeof data === 'object') {
      state = deepmerge(state, data)
      Logger.session(JSON.stringify(state))
    } else {
      console.log("ERROR IN SESSION")
      throw 'Update only accepts objects'
    }
  }
}
