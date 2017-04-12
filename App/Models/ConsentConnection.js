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

export const E_CONNECTION_ALREADY_EXISTS = 0x01
export const E_COULD_NOT_FETCH_PROFILE = 0x02
export const E_CONNECTION_DOES_NOT_EXIST = 0x03
export const E_COULD_NOT_SET_ITEM = 0x0

const STORAGE_KEY = 'connections'
const LOGTAG = 'ConsentConnection'

class ConsentConnection {

  /**
   * Add a connection
   * @param {number} id the id of the connection
   * @param {number} to_id the id of the user connected to
   * @returns {boolean} true on success
   * @throws {Error} E_COULD_NOT_FETCH_PROFILE
   *                 E_CONNECTION_ALREADY_EXISTS
   *                 E_COULD_NOT_SET_ITEM
   */
  static add(id, to_did) {
    return Promise.all([
      Api.profile({ did: to_did }),
      AsyncStorage.getItem(STORAGE_KEY)
    ])
    .then(result => {

      // Rename for clarity
      const response = result[0]
      const connectionsItem = result[1]

      // Check response is as expected
      if (!response || !response.body || response.status !== 200) {
        // return Promise.reject('Unexpected response from server')
        return Promise.reject(
          new ConsentError(
            'Unexpected response from server',
            E_COULD_NOT_FETCH_PROFILE
          )
        )
      }
      let display_name = null
      // Grab display_name from API response and capitalize first letter
      if (response.body.user.display_name) {
        display_name = response.body.user.display_name
      } else {
        display_name = 'Mystery User'
      }
      // const nickname = (response.body.user.display_name.charAt(0).toUpperCase()
      //                  + response.body.user.display_name.substring(1))

      // Keep these for later
      const image_uri = response.body.user.image_uri
      const user_id = response.body.user_id
      const colour = response.body.colour

      // If entry does not exist, create from scratch
      if (!connectionsItem) {
        const connectionsItemJSON = JSON.stringify([{
          id: parseInt(id),
          to_did: to_did,
          display_name: display_name
        }])
        return Promise.all([
          AsyncStorage.setItem(STORAGE_KEY, connectionsItemJSON),
          ConsentDiscoveredUser.add(user_id, to_did, display_name, colour)
        ])
      }

      // Parse JSON to object
      const connections = JSON.parse(connectionsItem)

      // Check if already connected
      if (connections.find(connection => connection.to_did === to_did)) {
        // Connection already exists
        return Promise.reject(
          new ConsentError(
            `Connection ${to_did} already exists`,
            E_CONNECTION_ALREADY_EXISTS
          )
        )
      } else {
        // merge new data
        const updatedConnectionsItem = JSON.stringify(connections.concat({
          id: parseInt(id),
          to: parseInt(to_did),
          nickname: nickname
        }))
        return Promise.all([
          AsyncStorage.setItem(STORAGE_KEY, updatedConnectionsItem),
          ConsentDiscoveredUser.add(user_id, to_did, nickname, colour, image_uri)
        ])
      }
    })
    .then(result => {
      if (result[0] && result[1]) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(
          new ConsentError(
            `Error updating store ${STORAGE_KEY}`,
            E_COULD_NOT_SET_ITEM
          )
        )
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
        return Promise.resolve(connections)
      } else {
        return Promise.resolve([])
      }
    })
  }

}

export default ConsentConnection
