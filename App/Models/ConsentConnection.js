/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import { AsyncStorage } from 'react-native'
import Api from '../Api'
import Logger from '../Logger'
import ConsentError from '../ConsentError'
import ConsentDiscoveredUser from './ConsentDiscoveredUser'
import _ from 'lodash'

export const E_CONNECTION_ALREADY_EXISTS = 0x01
export const E_COULD_NOT_FETCH_PROFILE = 0x02
export const E_CONNECTION_DOES_NOT_EXIST = 0x03
export const E_COULD_NOT_SET_ITEM = 0x0

const STORAGE_KEY = 'connections'
const LOGTAG = 'ConsentConnection'

class ConsentConnection {

  static add(id, to_did) {
    // Logger.info('id - did', JSON.stringify({ id, to_did }))
    if (!(id && to_did) ||
        typeof to_did !== 'string' ||
        !(typeof id === 'string' || typeof id === 'number')) {
      return Promise.reject(new Error(`${id} is not a valid id or ${to_did} is not a valid did`))
    }

    // Fetch profile and load connections storage
    return Promise.all([
      Api.profile({ did: to_did }),
      AsyncStorage.getItem(STORAGE_KEY)
    ]).then(result => {
      // Rename for clarity
      const response = result[0]
      const connectionsItemJSON = result[1]

      // Check response is as expected
      if (!response || !response.body || response.status !== 200) {
        Logger.warn(`Unexpected response from server. Profile for ${to_did} will not be updated.`)
        return
      }

      // Reassign for clarity
      const fetched_image_uri = response.body.user.image_uri
      const fetched_colour = response.body.user.colour
      const fetched_display_name = response.body.user.display_name

      // Build object
      const newConnectionItem = {
        id: parseInt(id, 10) || null,
        to_did: to_did
      }

      // Only add valid data
      if (fetched_image_uri) { newConnectionItem.image_uri = fetched_image_uri }
      if (fetched_colour) { newConnectionItem.colour = fetched_colour }
      if (fetched_display_name) { newConnectionItem.display_name = fetched_display_name}


      // If entry does not exist, create entire store from scratch
      if (!connectionsItemJSON) {
        const newConnectionsItemJSON = JSON.stringify([newConnectionItem])
        return AsyncStorage.setItem(STORAGE_KEY, newConnectionsItemJSON)
      } else {
        // Parse database JSON
        const storedConnections = JSON.parse(connectionsItemJSON)

        // The key is empty
        if (_.isEmpty(storedConnections)) {
          const newConnectionsItemJSON = JSON.stringify([newConnectionItem])
          return AsyncStorage.setItem(STORAGE_KEY, newConnectionsItemJSON)
        } else {
          const exists = storedConnections.find(connection => connection.to_did === to_did)
          if (exists) {
            // TODO: Compare and update
            // or now just warn and go on
            return Promise.resolve()
          } else {
            // Add to stack
            storedConnections.push(newConnectionItem)
            const storedConnectionsJSON = JSON.stringify(storedConnections)
            return AsyncStorage.setItem(STORAGE_KEY, storedConnectionsJSON)
          }
        }
      }
    })
  }

  /**
   * Remove a ConsentConnection
   * @param {number} id The id of the connection to remove
   * @returns {any} true if something was removed
   */
  static remove(id) {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {
        const connections = JSON.parse(itemJSON)
        const updatedConnections = connections.filter(connection => connection.id !== id)
        return AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedConnections)
        )
      } else {
        Logger.info(`${STORAGE_KEY} storage is empty. Nothing to remove`, LOGTAG)
        return Promise.resolve(false)
      }
    })
  }

  /**
   * Trash the key
   * @returns {boolean} true on success
   */
  static purge() {
    return AsyncStorage.removeItem(STORAGE_KEY)
  }

  /*
   * Get a single connection
   * @param {number} id The id of the connection
   * @returns {object} connection The connection
   */
  static get(id) {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {
        const connections = JSON.parse(itemJSON)
        const connection = connections.find(connection => connection.id === id)
        if (connection) {
          return Promise.resolve(connection)
        } else {
          return Promise.reject(
            new ConsentError(
              `${STORAGE_KEY}.[id:${id}] does not exist`,
              E_CONNECTION_DOES_NOT_EXIST
            )
          )
        }
      } else {
        // none exist
        return Promise.reject(
          new ConsentError(
            `${STORAGE_KEY} storage is empty. Nothing to get`,
            E_CONNECTION_DOES_NOT_EXIST
          )
        )
      }
    })
  }

  /**
   * Get an array of all connections
   * @returns {Array} connections An array of connections
   */
  static all() {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {
        const connections = JSON.parse(itemJSON)
        if (_.isEmpty(connections)) {
          return Promise.resolve([])
        } else {
          return Promise.resolve(connections)
        }
      } else {
        return Promise.resolve([])
      }
    })
  }

}

export default ConsentConnection
