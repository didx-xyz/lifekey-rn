/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import { AsyncStorage } from 'react-native'
import Api from '../Api'
import Logger from '../Logger'
/*
{
  "notification": {
    "color":null,
    "clickAction":null,
    "sound":null,
    "tag":null,
    "body":"New information sharing agreement",
    "title":"New Information Sharing Agreement"
  },
  "data": {
    "isar_id":"4",
    "type":"information_sharing_agreement_request",
    "from_did":"57"
  },
  "sendTime":"1491520483656",
  "type":null,
  "collapseKey":"com.lifekeyrn",
  "to":null,
  "from":"953467338291"
}
04-07 01:14:43.705  4582  4729 I ReactNativeJS: [FB] {"notification":{"color":null,"clickAction":null,"sound":null,"tag":null,"body":"New information sharing agreement","title":"New Information Sharing Agreement"},"data":{"isar_id":"4","type":"information_sharing_agreement_request","from_did":"57"},"sendTime":"1491520483656","type":null,"collapseKey":"com.lifekeyrn","to":null,"from":"953467338291"}
*/

class ConsentISA {

  static storageKey = 'isas'

  static add(id, from_did) {
    return Promise.all([
      Api.respondISA({
        isa_id: id,
        accepted: true,
        permitted_resources: 'dunno'
      }),
      AsyncStorage.getItem(ConsentISA.storageKey)
    ])
    .then(result => {

      // Rename for clarity and convenience
      const response = result[0]

      // Check response is as expected
      if (!response || !response.body || response.status !== 200) {
        return Promise.reject('Unexpected response from server')
      }

      // Grab ISA THINGS
      // SO MUCH WAS GRABBED

      // If entry does not exist, create from scratch
      if (!result[1]) {
        const isasItem = JSON.stringify([{
          id, from_did
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
        const updatedIsaItem = JSON.stringify(isas.concat({ id, from_did }))
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
