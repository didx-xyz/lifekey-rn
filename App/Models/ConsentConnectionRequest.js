/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import { AsyncStorage } from 'react-native'
class ConsentConnectionRequest {

  static storageKey = 'connection_requests'

  static add(id, from_id, from_did, from_nickname) {
    return AsyncStorage.getItem(ConsentConnectionRequest.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const connectionRequests = JSON.parse(itemJSON)
        if (connectionRequests.find(connectionRequest => connectionRequest.id === id)) {
          // already exists
          return Promise.reject(`ConnectionRequest ${id} already exists`)
        } else {
          // merge new connection
          const updatedConnectionRequests = connectionRequests.concat(
            { id, from_id, from_did, from_nickname }
          )
          return AsyncStorage.setItem(
            ConsentConnectionRequest.storageKey,
            JSON.stringify(updatedConnectionRequests)
          )
        }
      } else {
        // create from scratch
        const connectionRequests = [{ id, from_id, from_did, from_nickname }]
        return AsyncStorage.setItem(
          ConsentConnectionRequest.storageKey,
          JSON.stringify(connectionRequests)
        )
      }
    })
  }

  static remove(id) {
    return AsyncStorage.getItem(ConsentConnectionRequest.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const connectionRequests = JSON.parse(itemJSON)
        const updatedConnectionRequests = connectionRequests.filter(connectionRequest => connectionRequest.id !== id)
        return AsyncStorage.setItem(ConsentConnectionRequest.storageKey, JSON.stringify(updatedConnectionRequests))
      } else {
        return Promise.reject(`${ConsentConnectionRequest.storageKey} storage is empty. Nothing to remove`)
      }
    })
  }

  /**
   * Trash the key
   */
  static purge() {
    return AsyncStorage.removeItem(ConsentConnectionRequest.storageKey)
  }

  static get(id) {
    return AsyncStorage.getItem(ConsentConnectionRequest.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const connectionRequests = JSON.parse(itemJSON)
        const connectionRequest = connectionRequests.find(connectionRequest => connectionRequest.id === id)
        if (connectionRequest) {
          return Promise.resolve(connectionRequest)
        } else {
          return Promise.reject(`${ConsentConnectionRequest.storageKey}.[id:${id}] does not exist`)
        }
      } else {
        // none exist
        return Promise.reject(`${ConsentConnectionRequest.storageKey} storage is empty. Nothing to get`)
      }
    })
  }

  static all() {
    return AsyncStorage.getItem(ConsentConnectionRequest.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const connectionRequests = JSON.parse(itemJSON)
        return Promise.resolve(connectionRequests)
      } else {
        return Promise.resolve([])
      }
    })
  }

}

export default ConsentConnectionRequest
