/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import { AsyncStorage } from 'react-native'
import Api from '../Api'
import Logger from '../Logger'

class ConsentISA {

  static storageKey = 'isas'

  static add(id, from_id) {
    return Promise.all([
      Api.profile({ id: from_id }),
      AsyncStorage.getItem(ConsentISA.storageKey)
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
        const isasItem = JSON.stringify([{
          id, from_id, nickname
        }])
        return AsyncStorage.setItem(ConsentISA.storageKey, isasItem)
      }

      // Parse JSON to object
      const isas = JSON.parse(result[1])

      // Check if already exists
      if (isas.find(connection => connection.id === id)) {
        // Connection already exists
        return Promise.reject(`ISA ${id} already exists`)
      } else {
        // merge new data
        const updatedIsaItem = JSON.stringify(isas.concat({ id, from_id, nickname }))
        return AsyncStorage.setItem(ConsentISA.storageKey, updatedIsaItem)
      }
    })
    .then(result => {
      if (result) {
        Logger.info('Connection created')
        return Promise.resolve(true)
      } else {
        return Promise.reject('Could not add ISA')
      }
    })
  }

  static remove(id) {
    return AsyncStorage.getItem(ConsentISA.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const isas = JSON.parse(itemJSON)
        const updatedIsas = isas.filter(isa => isa.id !== id)
        return AsyncStorage.setItem(ConsentISA.storageKey, JSON.stringify(updatedIsas))
      } else {
        return Promise.reject(`${ConsentISA.storageKey} storage is empty. Nothing to remove`)
      }
    })
  }

  /**
   * Trash the key
   */
  static purge() {
    return AsyncStorage.removeItem(ConsentISA.storageKey)
  }

  static get(id) {
    return AsyncStorage.getItem(ConsentISA.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const isas = JSON.parse(itemJSON)
        const isa = isas.find(isa => isa.id === id)
        if (isa) {
          return Promise.resolve(isa)
        } else {
          return Promise.reject(`${ConsentISA.storageKey}.[id:${id}] does not exist`)
        }
      } else {
        // none exist
        return Promise.reject(`${ConsentISA.storageKey} storage is empty. Nothing to get`)
      }
    })
  }

  static all() {
    return AsyncStorage.getItem(ConsentISA.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        const isas = JSON.parse(itemJSON)
        return Promise.resolve(isas)
      } else {
        return Promise.resolve([])
      }
    })
  }

}

export default ConsentISA
