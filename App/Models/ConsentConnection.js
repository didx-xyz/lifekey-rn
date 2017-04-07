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

const E_CONNECTION_ALREADY_EXISTS = 0x01
const STORAGE_KEY = 'connections'

class ConsentConnectionError extends ConsentError {
  constructor(message, code) {
    super(message)
    this.name = this.constructor.name
    this.code = code

  }
}

class ConsentConnection {

  static storageKey = 'connections'

  static add(id, to_id) {
    return Promise.all([
      Api.profile({ id: to_id }),
      AsyncStorage.getItem(ConsentConnection.storageKey)
    ])
    .then(result => {

      // Rename for clarity and convenience
      const response = result[0]

      // Check response is as expected
      if (!response || !response.body || response.status !== 200) {
        // return Promise.reject('Unexpected response from server')
        return Promise.reject(new Error('Unexpected response from server'))
      }

      // Grab nickname from API response and capitalize first letter
      const nickname = response.body.user.nickname.charAt(0).toUpperCase()
                       + response.body.user.nickname.substring(1)

      // If entry does not exist, create from scratch
      if (!result[1]) {
        const connectionsItem = JSON.stringify([{ id, to: to_id, nickname }])
        return AsyncStorage.setItem(ConsentConnection.storageKey, connectionsItem)
      }

      // Parse JSON to object
      const connections = JSON.parse(result[1])

      // Check if already connected
      if (connections.find(connection => connection.to === to_id)) {
        // Connection already exists
        return Promise.reject(
          new ConsentConnectionError(`Connection ${to_id} already exists`, E_CONNECTION_ALREADY_EXISTS)
        )
      } else {
        // merge new data
        const updatedConnectionsItem = JSON.stringify(connections.concat({ id, to: to_id, nickname }))
        return AsyncStorage.setItem(ConsentConnection.storageKey, updatedConnectionsItem)
      }
    })
  }

  static remove(id) {
    return AsyncStorage.getItem(ConsentConnection.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const connections = JSON.parse(itemJSON)
        const updatedConnections = connections.filter(connection => connection.id !== id)
        return AsyncStorage.setItem(ConsentConnection.storageKey, JSON.stringify(updatedConnections))
      } else {
        return Promise.reject(`${ConsentConnection.storageKey} storage is empty. Nothing to remove`)
      }
    })
  }

  /**
   * Trash the key
   */
  static purge() {
    return AsyncStorage.removeItem(ConsentConnection.storageKey)
  }

  static get(id) {
    return AsyncStorage.getItem(ConsentConnection.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const connections = JSON.parse(itemJSON)
        const connection = connections.find(connection => connection.id === id)
        if (connection) {
          return Promise.resolve(connection)
        } else {
          return Promise.reject(`${ConsentConnection.storageKey}.[id:${id}] does not exist`)
        }
      } else {
        // none exist
        return Promise.reject(`${ConsentConnection.storageKey} storage is empty. Nothing to get`)
      }
    })
  }

  static all() {
    return AsyncStorage.getItem(ConsentConnection.storageKey)
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
