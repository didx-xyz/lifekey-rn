
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

  // static async add(created_at, from_user, amount, reason) {
  //   const newThanksMessage = { created_at, from_user, amount, reason }
  //   try {
  //     const item = await AsyncStorage.getItem(STORAGE_KEY)
  //     if (item) {
  //       const newItem = item.concat(newThanksMessage)
  //       const newItemJSON = JSON.parse(newItem)
  //       const result = await AsyncStorage.setItem(STORAGE_KEY, newItemJSON)
  //       if (result) {
  //         Logger.info('Thanks saved', result)
  //       } else {
  //         Logger.warn('Thanks not saved', result)
  //       }
  //     }
  //   } catch (error) {
  //     Logger.warn('Key does not yet exist', error)
  //     const firstItemJSON = JSON.parse(newThanksMessage)
  //     const result = await AsyncStorage.setItem(STORAGE_KEY, firstItemJSON)
  //     if (result) {
  //       Logger.info('Thanks saved', result)
  //     } else {
  //       Logger.warn('Thanks not saved', result)
  //     }
  //   }
  // }

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
