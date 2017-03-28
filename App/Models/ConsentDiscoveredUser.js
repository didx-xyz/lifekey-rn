/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Session from '../Session'
import { AsyncStorage } from 'react-native'

class ConsentDiscoveredUser {

  static storageKey = 'discovered_users'

  static add(id, did, nickname) {
    return AsyncStorage.getItem(ConsentDiscoveredUser.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const discoveredUsers = JSON.parse(itemJSON)
        if (discoveredUsers.find(discoveredUser => discoveredUser.id === id)) {
          // already exists
          return Promise.reject(`DiscoveredUser ${id} already exists`)
        } else {
          // merge new connection
          const updatedDiscoveredUser = discoveredUsers.concat(
            { id, did, nickname }
          )
          return AsyncStorage.setItem(
            ConsentDiscoveredUser.storageKey,
            JSON.stringify(updatedDiscoveredUser)
          )
        }
      } else {
        // create from scratch
        const discoveredUsers = [{ id, did, nickname }]
        return AsyncStorage.setItem(
          ConsentDiscoveredUser.storageKey,
          JSON.stringify(discoveredUsers)
        )
      }
    })
  }

  static remove(id) {
    return AsyncStorage.getItem(ConsentDiscoveredUser.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const discoveredUsers = JSON.parse(itemJSON)
        const updatedDiscoveredUsers = discoveredUsers.filter(discoveredUser => discoveredUser.id !== id)
        return AsyncStorage.setItem(ConsentDiscoveredUser.storageKey, JSON.stringify(updatedDiscoveredUsers))
      } else {
        return Promise.reject(`${ConsentDiscoveredUser.storageKey} storage is empty. Nothing to remove`)
      }
    })
  }

  static get(id) {
    return AsyncStorage.getItem(ConsentDiscoveredUser.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const discoveredUsers = JSON.parse(itemJSON)
        const discoveredUser = discoveredUsers.find(discoveredUser => discoveredUser.id === id)
        if (discoveredUser) {
          return Promise.resolve(discoveredUser)
        } else {
          return Promise.reject(`${ConsentDiscoveredUser.storageKey}.[id:${id}] does not exist`)
        }
      } else {
        // none exist
        return Promise.reject(`${ConsentDiscoveredUser.storageKey} storage is empty. Nothing to get`)
      }
    })
  }

  static all() {
    return AsyncStorage.getItem(ConsentDiscoveredUser.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const discoveredUsers = JSON.parse(itemJSON)
        return Promise.resolve(discoveredUsers)
      } else {
        return Promise.reject(`${ConsentDiscoveredUser.storageKey} storage is empty. Nothing to get`)
      }
    })
  }
}

export default ConsentDiscoveredUser
