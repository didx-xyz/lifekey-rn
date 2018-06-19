
import {AsyncStorage} from 'react-native'

var STORAGE_KEY = 'user_share'

export default class ConsentUserShare {

  static add(resource) {
    if (!resource.from_user_did) {
      return false //Promise.reject('resource has no `from_user_did` field')
    }
    return AsyncStorage.getItem(
      STORAGE_KEY
    ).then(item => {
      var user_shares = item ? JSON.parse(item) : {}
      user_shares[resource.from_user_did] = user_shares[resource.from_user_did] || {}
      user_shares[resource.from_user_did][resource.id] = resource
      return AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user_shares)
      )
    })
  }

  static remove_one_by_user(resource_id, from_user_did) {
    return AsyncStorage.getItem(
      STORAGE_KEY
    ).then(item => {
      if (!item) return Promise.resolve()
      var user_shares = JSON.parse(item)
      delete user_shares[from_user_did][resource_id]
      return AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user_shares)
      )
    })
  }

  static remove_all_by_user(from_user_did) {
    return AsyncStorage.getItem(
      STORAGE_KEY
    ).then(item => {
      if (!item) return Promise.resolve()
      var user_shares = JSON.parse(item)
      delete user_shares[from_user_did]
      return AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user_shares)
      )
    })
  }

  static all() {
    return AsyncStorage.getItem(
      STORAGE_KEY
    ).then(item => {
      return Promise.resolve(
        item ?
        JSON.parse(item) :
        {}
      )
    })
  }

  static all_by_user(user_did) {
    return AsyncStorage.getItem(
      STORAGE_KEY
    ).then(item => {
      if (!item) return Promise.resolve([])
      var user_shares = JSON.parse(item)
      return Promise.resolve(
        user_shares[user_did] ?
        Object.values(user_shares[user_did]) :
        []
      )
    })
  }
}
