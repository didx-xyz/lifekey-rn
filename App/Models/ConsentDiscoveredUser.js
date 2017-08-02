/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Logger from '../Logger'
import { AsyncStorage } from 'react-native'
import ConsentError from '../ConsentError'
import _ from 'lodash'
import Util from '../Util'

export const E_USER_ALREADY_EXISTS = 0x01
export const E_USER_DOES_NOT_EXIST = 0x02

const STORAGE_KEY = 'discovered_users'
const LOGTAG = 'DiscoveredUser'

class ConsentDiscoveredUser {
  // update

  static async update(data) {
    Logger.asyncStorage(STORAGE_KEY, data)
    // Util.checkParameters(['did'], data)
    const discoveredUsersJSON = await AsyncStorage.getItem(STORAGE_KEY)
    if (discoveredUsersJSON) {

      // storage exists
      const discoveredUsers = JSON.parse(discoveredUsersJSON)
      if (!discoveredUsers || typeof discoveredUsers !== 'object') {
        throw new Error('Could not parse JSON')
      }

      const discoveredUser = _.find(discoveredUsers, { did: data.did })


      if (!discoveredUser) {
        // key does not exist
        const newDiscoveredUsers = discoveredUsers.push(data)
        return await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDiscoveredUsers))
      } else {

        const newDiscoveredUser = _.merge({}, discoveredUser, data)


        const newDiscoveredUsers = _.merge([], discoveredUsers, [newDiscoveredUser])

        return await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDiscoveredUsers))
      }
    } else {
      // first item in storage_key
      return await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([data]))
    }
  }

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
  static add(did, nickname, colour, image_uri, display_name, address, tel, email) {

    const newDiscoveredUser = {
      did,
      nickname,
      colour,
      image_uri,
      display_name,
      address,
      tel,
      email
    }

    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {
        const discoveredUsers = JSON.parse(itemJSON)
        if (discoveredUsers.find(discoveredUser => discoveredUser.did === did)) {
          // already exists
          Logger.info(`DiscoveredUser ${did} already exists`)
          return Promise.resolve(false)
        } else {
          // merge new connection
          const updatedDiscoveredUser = discoveredUsers.concat(newDiscoveredUser)
          return AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedDiscoveredUser)
          )
        }
      } else {
        // create from scratch
        const discoveredUsers = [newDiscoveredUser]
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
  static get(did) {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {

        // Parse JSON
        const discoveredUsers = JSON.parse(itemJSON)

        // Find record
        const discoveredUser = discoveredUsers.find(
          user => user.did === did
        )

        if (discoveredUser) {
          // Return data
          return Promise.resolve(discoveredUser)
        } else {
          Logger.info(`${STORAGE_KEY}.did::${did} does not exist`)
          return Promise.resolve(null)
        }
      } else {
        // none exist
        return Promise.reject(
          new Error(`${STORAGE_KEY} storage is empty. Nothing to get`)
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
