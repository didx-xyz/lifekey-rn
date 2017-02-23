/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import {
  Platform,
  Navigator
} from 'react-native'
import Routes from './Routes'
import Palette from './Palette'

const pkg = require('../package.json')

const APP_NAME = 'Lifekey'
const SERVER = 'staging.lifekey.cnsnt.io'
const SCHEME = 'http://'
const DEBUG = true
const API_VERSION = 1
const TOKEN_REFRESH_URL = "http://staging.api.lifekey.cnsnt.io/management/device"


/**
 * The configuration file for the App
 */
export default {

  // The full name of the application
  appName: APP_NAME,

  // First scene to show
  // initialRoute: Routes.debugRegister,
  initialRoute: Routes.debug,

  // Predefined error messages
  errorMessage: {
    login: {
      title: 'Invalid login',
      message: ''
    },
    network: {
      title: 'Network Error',
      message: 'Could not connect to server. Please ensure you are connected to the internet'
    }
  },

  debug: DEBUG,          // Main switch
  debugNetwork: false,   // HTTP
  debugReact: true,      // Show react lifescylce data
  debugNavigator: false,
  debugAutoLogin: true,

  // App version
  version: pkg.version,

  // React Native version
  rnVersion: pkg.dependencies['react-native'].substring(1),

  // Android navigator transitions
  sceneConfig: Navigator.SceneConfigs.FloatFromRight,
  sceneTransitionMinumumTime: 200,

  // Modal settings
  progressBarColor: Palette.consentOrange,

  // Server details
  http: {
    tokenRefreshUrl: TOKEN_REFRESH_URL,
    server: SERVER,
    baseUrl: SCHEME + SERVER,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'x-client-platform': APP_NAME + Platform.OS + ' v' + pkg.version,
      'x-client-version': pkg.version,
      'x-cnsnt-did': 'did',
      'x-cnsnt-signature': 'sig',
      'Content-Type': 'application/json'
    }
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

