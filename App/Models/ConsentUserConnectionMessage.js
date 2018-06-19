
import {AsyncStorage} from 'react-native'

class ConsentUserConnectionMessage {

  static storageKey = 'user_connection_message'

  static async add(from_did, message_text, timestamp) {
    try {
      const itemJSON = await AsyncStorage.getItem(this.storageKey)
      if (itemJSON) {
        // exists
        const item = JSON.parse(itemJSON)
        const updatedItem = item.concat([{
          from_did: from_did,
          message_text: message_text,
          timestamp: timestamp
        }])
        const updatedItemJSON = JSON.stringify(updatedItem)
        const result = await AsyncStorage.setItem(
          this.storageKey,
          updatedItemJSON
        )
      } else {
        // does not exist, create first record
        const itemJSON = JSON.stringify([{
          from_did: from_did,
          message_text: message_text,
          timestamp: timestamp
        }])
        const result = await AsyncStorage.setItem(
          this.storageKey,
          itemJSON
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  static async purge() {
    try {
      AsyncStorage.removeItem(this.storageKey)
    } catch (error) {
      console.log(error)
    }
  }

  static async all() {
    try {
      const itemJSON = await AsyncStorage.getItem(this.storageKey)
      const item = JSON.parse(itemJSON)
      return item || []
    } catch (error) {
      console.log(error)
      return []
    }
  }

  static async from(user) {
    try {
      const itemJSON = await ConsentUserConnectionMessage.all()
      return itemJSON.filter(i => {
        return i.from_did === user
      })
    } catch (error) {
      console.log(error)
      return []
    }
  }
}

export default ConsentUserConnectionMessage