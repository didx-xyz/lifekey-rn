/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Logger from './Logger'

import { AsyncStorage } from 'react-native'

export default class Storage {

  static store(key, value) {
    return new Promise((resolve, reject) => {
      if ((typeof value !== 'object') || (typeof key !== 'string')) {
        reject('Key must be a string and value must be an object')
      }
      return AsyncStorage.mergeItem(key, JSON.stringify(value))
      .then(resolve)
      .catch(error => {
        Logger.error(error, 'Storage')
        reject(error)
      })
    })
  }

  static load(key) {
    return new Promise((resolve, reject) => {
      if (typeof key !== 'string') {
        reject('Key must be a string')
      } else {
        return AsyncStorage.getItem(key)
        .then(result => {
          if (result) {
            resolve(JSON.parse(result))
          } else {
            reject(`AsyncStorage Key "${key}" does not exist`)
          }
        })
        .catch(error => {
          Logger.error(error, 'Storage')
          reject(error)
        })
      }
    })

  }
}
