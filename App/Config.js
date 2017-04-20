/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import { Navigator } from 'react-native'
import Routes from './Routes'
import Palette from './Palette'
const NPM_PACKAGE = require('../package.json')
const BUILD_CONFIG = require('../cfg/dev.json')
const APP_NAME = 'Lifekey'

/**
 * The configuration file for the App
 */
export default {

  // The full name of the application
  APP_NAME: APP_NAME,

  // First scene to show
  initialRouteFromConfig: false, // Must be true to use route below
  initialRoute: Routes.onboarding.splashScreen,

  // Allow requests from whitelisted user (testing on iOS, without login)
  useWhitelistedUser: true,
  whitelistedUserId: 2,
  whitelistedUserPlain: "example",
  whitelistedUserSigned: "example",

  // Debug
  DEBUG: BUILD_CONFIG.DEBUG,  // All logging on/off (MASTER)
  debugNetwork: true,         // Log API requests and responses
  debugReact: false,           // Log the React Lifecycle events
  debugNavigator: false,      // Log the current stack of Navigator routes
  debugFirebase: false,        // Log Firebase events
  debugAsyncStorage: false,
  debugAutoLogin: false,
  debugAutoLoginPassword: '99999',

  version: NPM_PACKAGE.version, // App version

  // React Native version
  rnVersion: NPM_PACKAGE.dependencies['react-native'].substring(1),

  // Android navigator transitions
  sceneConfig: Navigator.SceneConfigs.FloatFromRight,

  // Modal settings
  progressBarColor: Palette.consentBlue,

  // HTTP settings
  http: {
    server: BUILD_CONFIG.SERVER,
    baseUrl: 'http://' + BUILD_CONFIG.SERVER,
  },

  keystore: {
    name: APP_NAME.toLowerCase(),
    pemCertificatePath: 'rsa-example.pem',
    keyName: APP_NAME.toLowerCase(), // TODO: Deprecate
    privateKeyName: 'private' + APP_NAME.toLowerCase(), // Do not change this because it's hardcoded on the java side
    publicKeyName: 'public' + APP_NAME.toLowerCase(),   // or this
    publicKeyAlgorithm: 'rsa'
  }

}
