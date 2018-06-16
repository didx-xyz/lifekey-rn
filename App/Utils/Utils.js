import CodePush from 'react-native-code-push'
import { Alert } from 'react-native'

export default class Utils {

  static appVersion = "v1.0.12"

  static checkForUpdate(silent = true) {
    CodePush.sync({
      updateDialog: true,
      installMode: CodePush.InstallMode.ON_NEXT_RESTART
    }, (status) => {
      if (status === CodePush.SyncStatus.UPDATE_INSTALLED) {
        Alert.alert('Success', 'Update installed, please restart app')
      }
      if (status === CodePush.SyncStatus.UP_TO_DATE && !silent) {
        Alert.alert('Success', 'App is already up to date')
      }
    })
  }
}
