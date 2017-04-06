/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import { AsyncStorage } from 'react-native'
import Api from '../Api'
import Logger from '../Logger'

class ConsentConnection {

  static storageKey = 'connections'

  static add(id, from_id) {
    return Promise.all([
      Api.profile({ id: id }),
      AsyncStorage.getItem(ConsentConnection.storageKey)
    ])
    .then(result => {

      // Rename for clarity and convenience
      const response = result[0]

      // Check response is as expected
      if (!response || !response.body || response.status !== 200) {
        return Promise.reject('Unexpected response from server')
      }

      // Grab nickname from API response and capitalize first letter
      const nickname = response.body.user.nickname.charAt(0).toUpperCase()
                       + response.body.user.nickname.substring(1)

      // If entry does not exist, create from scratch
      if (!result[1]) {
        const connectionsItem = JSON.stringify([{ id, from_id, nickname }])
        return AsyncStorage.setItem(ConsentConnection.storageKey, connectionsItem)
      }

      // Parse JSON to object
      const connections = JSON.parse(result[1])

      // Check if already exists
      if (connections.find(connection => connection.id === id)) {
        // Connection already exists
        return Promise.reject(`Connections ${id} already exists`)
      } else {
        // merge new data
        const updatedConnectionsItem = JSON.stringify(connections.concat({ id, from_id, nickname }))
        return AsyncStorage.setItem(ConsentConnection.storageKey, updatedConnectionsItem)
      }
    })
    .then(result => {
      if (result) {
        Logger.info('Connection created')
        return Promise.resolve(true)
      } else {
        return Promise.reject('Could not add ConnectionRequest')
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
