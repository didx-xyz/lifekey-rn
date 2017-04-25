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
  suggestedConnections: [
    { did: '7dc1ddd0c7452a96968d9604bee07edb60251efff189f841662ed4643797e1bc', display_name: 'Woolworths' }
  ],
  // Allow requests from whitelisted user (testing on iOS, without login)
  useWhitelistedUser: false,
  whitelistedUserId: 2,
  whitelistedUserPlain: "example",
  whitelistedUserSigned: "example",

  // Debug
  DEBUG: BUILD_CONFIG.DEBUG,  // All logging on/off (MASTER)
  debugNetwork: true,         // Log API requests and responses
  debugReact: false,          // Log the React Lifecycle events
  debugNavigator: false,      // Log the current stack of Navigator routes
  debugFirebase: true,        // Log Firebase events
  debugAsyncStorage: false,
  debugAutoLogin: false,
  debugAutoLoginPassword: '99999',

  hardcodedSuggestedConnections: false,
  suggestedConnections: [
    { did: 'ade95e3f8014c3eb4067ce82b185b42b7b50edd8493748808a7e73fe86f7338e', display_name: 'Testing'}
  ],

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
