
# lifeQi - Mobile

## Development

* install the android sdk
* install node lts/boron
* `yarn i ; react-native run-android ; react-native log-android`

#### Android Studio
* If the build is done through android studio and you need to view the logger
`adb logcat *:S ReactNative:V ReactNativeJS:V `

#### Pushing new fixes (only for js changes)

* Make sure you have appcenter cli installed
* `npm install -g appcenter-cli`
* `yarn run codepush:android`
* `yarn run codepush:ios`

#### Generating a APK release

* Generate a key
`keytool -genkey -v -keystore my-app-key.keystore -alias my-app-alias -keyalg RSA -keysize 2048 -validity 10000`
* Once the key is generated, use it to generate the installable build
`react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
* Then use Android Studio to generate the apk
