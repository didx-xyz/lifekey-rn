import CodePush from 'react-native-code-push'
import { Alert } from 'react-native'

export default class Utils {

  static appVersion = "v1.0.0"

  static checkForUpdate() {
    CodePush.sync({
      updateDialog: true,
      installMode: CodePush.InstallMode.ON_NEXT_RESTART
    }, (status) => {
      if (status === CodePush.SyncStatus.UPDATE_INSTALLED) {
        Alert.alert('Success', 'Update installed, please restart app')
      }
    })
  }
}
