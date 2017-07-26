
import {AsyncStorage} from 'react-native'

var STORAGE_KEY = 'share_log'

export default class ConsentShareLog {

  static add(resource_id, shared_with_did, extra_metadata) {
    return AsyncStorage.getItem(STORAGE_KEY).then(item => {
      var share_log = item ? JSON.parse(item) : {}
      share_log[shared_with_did] = share_log[shared_with_did] || []
      var new_record = {
        shared_at: new Date,
        resource_id: resource_id
      }
      if (extra_metadata) {
        new_record.extra_metadata = extra_metadata
      }
      share_log[shared_with_did].push(new_record)
      return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(share_log))
    })
  }

  static all_by_user(shared_with_did) {
    return AsyncStorage.getItem(STORAGE_KEY).then(item => {
      if (!item) return Promise.resolve([])
      var share_log = JSON.parse(item)
      return Promise.resolve(share_log[shared_with_did] || [])
    })
  }

  static all() {
    return AsyncStorage.getItem(STORAGE_KEY).then(item => {
      if (!item) return Promise.resolve({})
      var share_log = JSON.parse(item)
      return Promise.resolve(share_log)
    })
  }
}
