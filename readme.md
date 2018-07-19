
# lifeqi

### development

* install the android sdk
* install node lts/boron
* `npm i ; react-native run-android ; react-native log-android`

### Android Studio
* If the build is done through android studio and you need to view the logger
`adb logcat *:S ReactNative:V ReactNativeJS:V `

### push new fixes (only for js changes)
yarn run codepush:andoid
yarn run codepush:ios