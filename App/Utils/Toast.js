import {
  Platform,
  ToastAndroid
} from "react-native"
import Logger from '../Logger'

export default class Toast {
  static show(message, duration = ToastAndroid.SHORT) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, duration)
    } else {
      Logger.info(message)
    }
  }
}
