/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import { AsyncStorage } from 'react-native'

class ConsentConnection {

  static storageKey = 'connections'

  static add(id, from_id) {
    return AsyncStorage.getItem(ConsentConnection.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const connections = JSON.parse(itemJSON)
        if (connections.find(connection => connection.id === id)) {
          // already exists
          return Promise.reject(`Connections ${id} already exists`)
        } else {
          // merge new connection
          const updatedConnections = connections.concat({ id, from_id })
          return AsyncStorage.setItem(ConsentConnection.storageKey, JSON.stringify(updatedConnections))
        }
      } else {
        // create from scratch
        const connections = [{ id, from_id }]
        return AsyncStorage.setItem(ConsentConnection.storageKey, JSON.stringify(connections))
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
        return Promise.resolve({})
      }
    })
  }

}

export default ConsentConnection
