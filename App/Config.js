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
  initialRoute: BUILD_CONFIG.DEBUG ? Routes.connectionDetails    // Quick access
                      : Routes.onboarding.splashScreen,

  DEBUG: BUILD_CONFIG.DEBUG,  // All logging on/off (MASTER)
  debugNetwork: true,         // Log API requests and responses
  debugReact: true,          // Log the React Lifecycle events
  debugNavigator: false,      // Log the current stack of Navigator routes
  debugAsyncStorage: true,    // Log Storage (AsyncStorage) reads/writes
  debugFirebase: true,        // Log Firebase events

  version: NPM_PACKAGE.version, // App version

  // React Native version
  rnVersion: NPM_PACKAGE.dependencies['react-native'].substring(1),

  // Android navigator transitions
  sceneConfig: Navigator.SceneConfigs.FloatFromRight,
  sceneTransitionMinumumTime: 200,

  // Modal settings
  progressBarColor: Palette.consentBlue,

  // HTTP settings
  http: {
    // tokenRefreshUrl: TOKEN_REFRESH_URL,
    server: BUILD_CONFIG.SERVER,
    baseUrl: 'http://' + BUILD_CONFIG.SERVER,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'x-cnsnt-did': 'did',
      'x-cnsnt-signature': 'sig',
      'Content-Type': 'application/json'
    }
  },

  // AsyncStorage
  storage: {
    dbKey: 'cns_' + APP_NAME.toLowerCase() + '_storage'
  },
  keystore: {
    name: APP_NAME.toLowerCase(),
    pemCertificatePath: 'rsa-example.pem',
    keyName: APP_NAME.toLowerCase(), // TODO: Deprecate
    privateKeyName: 'private' + APP_NAME.toLowerCase(), // Do not change this because it's hardcoded on the java side
    publicKeyName: 'public' + APP_NAME.toLowerCase(),   // or this
    publicKeyAlgorithm: 'rsa'
  },
  // Google Analytics
  googleAnalytics: {
    trackers: {
      tracker1: ''
    },
    dispatchInterval: 120,
    samplingRate: 50,
    anonymizeIp: false,
    optOut: false
  }
}
