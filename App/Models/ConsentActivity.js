import Logger from '../Logger'
import {
  AsyncStorage
} from 'react-native'
import _ from 'lodash'

class ConsentActivity {

  static storageKey = 'activity'

  static async add(from_name, message_text, timestamp, onPress) {
    try {
      const itemJSON = await AsyncStorage.getItem(ConsentActivity.storageKey)
      if (itemJSON) {
        // exists
        const item = JSON.parse(itemJSON)
        const updatedItem = item.concat([{ from_name, message_text, timestamp }])
        const updatedItemJSON = JSON.stringify(updatedItem)
        const result = await AsyncStorage.setItem(this.storageKey, updatedItemJSON)
      } else {
        // does not exist, create first record
        const itemJSON = JSON.stringify([{ from_name, message_text, timestamp }])
        const result = await AsyncStorage.setItem(this.storageKey, itemJSON)
      }
    } catch (error) {
      Logger.warn(error)
    }
  }

  static async purge() {
    try {
      AsyncStorage.removeItem(ConsentActivity.storageKey)
    } catch (error) {
      Logger.warn(error)
    }
  }

  static async all() {
    try {
      const itemJSON = await AsyncStorage.getItem(this.storageKey)
      const item = JSON.parse(itemJSON)
      if (_.isEmpty(item)) {
        return ([])
      } else {
        return item
      }
    } catch(error) {
      Logger.warn(error)
    }
  }
}

export default ConsentActivity
