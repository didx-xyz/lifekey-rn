/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Logger from '../Logger'
import { AsyncStorage } from 'react-native'
import ConsentError from '../ConsentError'

export const E_USER_ALREADY_EXISTS = 0x01
export const E_USER_DOES_NOT_EXIST = 0x02

const STORAGE_KEY = 'discovered_users'
const LOGTAG = 'DiscoveredUser'

class ConsentDiscoveredUser {

  /**
   * Add a discovered user
   * @param {number} id The id of the connection
   * @param {string} did The decentralised identifier of the user
   * @param {string} nickname The user's nickname
   * @param {string} colour The user's theme colour
   * @param {string} image_uri The image URI for the user
   * @throws {Error} E_USER_ALREADY_EXISTS
   * @returns {boolean} success true on success
   */
  static add(id, did, nickname, colour, image_uri) {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {
        const discoveredUsers = JSON.parse(itemJSON)
        if (discoveredUsers.find(discoveredUser => discoveredUser.id === id)) {
          // already exists
          return Promise.reject(
            new ConsentError(
              `DiscoveredUser ${id} already exists`,
              E_USER_ALREADY_EXISTS
            )
          )
        } else {
          // merge new connection
          const updatedDiscoveredUser = discoveredUsers.concat(
            { id, did, nickname, colour, image_uri }
          )
          return AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedDiscoveredUser)
          )
        }
      } else {
        // create from scratch
        const discoveredUsers = [{ id, did, nickname, colour, image_uri }]
        return AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(discoveredUsers)
        )
      }
    })
  }

  /**
   * Remove a DiscoveredUser
   * @param {number} id The id of the user to remove
   * @returns {any} true if something was removed
   */
  static remove(id) {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {

        // Create version with item removed
        const updatedDiscoveredUsers = JSON.stringify(
          JSON.parse(itemJSON).filter(discoveredUser => discoveredUser.id !== id)
        )

        return AsyncStorage.setItem(
          STORAGE_KEY,
          updatedDiscoveredUsers
        )
      } else {
        Logger.info(`${STORAGE_KEY} storage is empty. Nothing to remove`, LOGTAG)
        return Promise.resolve(true)
      }
    })
  }

  /**
   * Get a DiscoveredUser
   * @param {number} id The id of the DiscoveredUser
   * @returns {object} discoveredUser The discovered user
   * @throws {Error} E_USER_DOES_NOT_EXIST
   */
  static get(id) {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {

        // Parse JSON
        const discoveredUsers = JSON.parse(itemJSON)

        // Find record
        const discoveredUser = discoveredUsers.find(
          discoveredUser => discoveredUser.id === id
        )

        if (discoveredUser) {
          // Return data
          return Promise.resolve(discoveredUser)
        } else {
          return Promise.reject(
            new ConsentError(
              `${STORAGE_KEY}.id::${id} does not exist`,
              E_USER_DOES_NOT_EXIST
            )
          )
        }
      } else {
        // none exist
        return Promise.reject(
          new ConsentError(
            `${STORAGE_KEY} storage is empty. Nothing to get`,
            E_USER_DOES_NOT_EXIST
          )
        )
      }
    })
  }

  /**
   * Get an array of all DiscoveredUsers
   * @returns {Array} discoveredUsers An array of DiscoveredUsers
   */
  static all() {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {
        const discoveredUsers = JSON.parse(itemJSON)
        return Promise.resolve(discoveredUsers)
      } else {
        return Promise.resolve([])
      }
    })
  }
}

export default ConsentDiscoveredUser
