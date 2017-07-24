
import Logger from '../Logger'
import { AsyncStorage } from 'react-native'

const STORAGE_KEY = 'thanks_messages'

class ConsentThanksMessage {

  static add(created_at, from, amount, reason) {

    var newThanksMessage = {
      created_at: created_at,
      from: from,
      amount: amount,
      reason: reason
    }

    return AsyncStorage.getItem(
      STORAGE_KEY
    ).then(item => {
      if (item) {
        const thanksMessages = JSON.parse(item)
        return AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(thanksMessages.concat(newThanksMessage))
        )
      } else {
        return AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([newThanksMessage])
        )
      }
    })
  }

  static all() {
    return AsyncStorage.getItem(
      STORAGE_KEY
    ).then(item => {
      return Promise.resolve(
        item ?
        JSON.parse(item) :
        []
      )
    })
  }
}

export default ConsentThanksMessage
