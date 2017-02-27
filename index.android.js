/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import {
  Config,
  Palette
} from './App'

import * as Lifecycle from './App/Lifecycle'
import Logger from './App/Logger'
import Crypto from './App/Crypto'
import Session from './App/Session'
import Storage from './App/Storage'

import EventEmitter from 'EventEmitter'
import React, { Component } from 'react';
import {
  View,
  Dimensions,
  AppRegistry,
  Navigator,
  DeviceEventEmitter,
  Platform
} from 'react-native';

const PORTRAIT = 0
const LANDSCAPE = 1

export default class Lifekeyrn extends Component {

  constructor(props) {
    super(props)
    this._fileName = 'index.android.js'
    this._className = this.constructor.name
    this._initialRoute = Config.initialRoute
    this._navigationEventEmitter = new EventEmitter()
    this.state = {
      orientation: null,
      screenWidth: null,
      screenHeight: null
    }
    Logger.info("Booting ReactNative " + Config.appName + " " + Config.version, this._fileName)
    DeviceEventEmitter.addListener('messageReceived', (e) => this._nativeEventMessageReceived(e))
    DeviceEventEmitter.addListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))

    Crypto.getKeyStoreList()
    .then(list => {
      if (list.find(x => x === "consent")) {
        Logger.info("Keystore detected, setting Session { userRegistered: true }", this._fileName)
        Session.update({
          keyStoreExists: true
        })
      } else {
        Logger.info("No keystore detected, setting Session { userRegistered: false }", this._fileName)
        Session.update({
          keyStoreExists: false
        })
      }
    })
    .catch(error => {
      Logger.error(error, this._fileName)
    })

    // Load Firebase token from storage
    Storage.load(Config.storage.dbKey)
    .then(storage => {
      if (storage === null) {
        // enoent
        if (Config.debug) {
          Logger.async(Config.storage.dbKey + " not found. No persistent app storage found")
        }
      } else {
        // storage found
        if (storage.firebaseToken) {
          Session.update({ firebaseToken: storage.firebaseToken })
          Logger.async("Restored firebase token from persistent storage")
        } else {
          Logger.async("No firebase token found in persistent storage")
        }
        if (storage.dbUserId) {
          Session.update({ dbUserId: storage.dbUserId })
          Logger.async("Restored dbUserId from persistent storage")
        } else {
          Logger.async("No dbUserId found in persistent storage")
        }
      }


    })
    .catch(error => {
      Logger.error(error, this._fileName)
    })
  }

  _nativeEventMessageReceived(msg) {
    alert(JSON.stringify(msg))
    if (msg.data.type === 'user_connection_request') {
      // how it appears in storage/Session: {user_connection_requests: {1: {...}, 2: {...}, etc...}}
      // keyed by database id: it has to be objects because we can't merge arrays

      var new_connection_request = { // the new record
        id: msg.data.user_connection_request_id,
        from_id: msg.data.from_id,
        from_did: msg.data.from_did,
        from_nickname: msg.data.from_nickname
      }
      var ucr_merge = {user_connection_requests: {}} // the field into which we merge the new record

      ucr_merge.user_connection_requests[
        msg.data.user_connection_request_id
      ] = new_connection_request // the record is to be keyed by database id

      // add it to session
      Storage.store(Config.storage.dbKey, { connections: ucr_merge })
      .then(() => {
        Session.update({ connections: ucr_merge })
      })
      .catch((err) => {
        Logger.error('uh oh, could not persist new user connection request', this._fileName)
      })
    }

  }

  _nativeEventTokenRefreshed(token) {
    if (Config.debug) {
      Logger.firebase("Token refresh event fired")
    }
    // add to Session
    Session.update({ firebaseToken: token })
    .then(() => Storage.store(Config.storage.dbKey, {
      firebaseToken: token
    }))
    .catch((err) => {
      throw "Unable to store firebase token"
    })

    const state = Session.getState()

    var pemKey
    if (state.registered) {
      const toSign = Date.now().toString()
      Crypto.sign(toSign, "private_lifekey", "consent", Crypto.SIG_SHA256_WITH_RSA)
      .then(sig => fetch(Config.http.tokenRefreshUrl, {
        method: 'POST',
        body: JSON.stringify({
          device_id: token,
          device_platform: Platform.OS
        }),
        headers: {
          "content-type": "application/json",
          "x-cnsnt-id": Session.getState().dbUserId,
          "x-cnsnt-plain": toSign,
          "x-cnsnt-signed": sig.trim()
        }
      }))
      .catch(error => {
        alert("Could not update token")
        Logger.error(error, this._fileName)
      })

    }
  }

  componentWillMount() {
    const initialDimensions = Dimensions.get('window')
    this.setState({
      screenWidth: Math.round(initialDimensions.width),
      screenHeight: Math.round(initialDimensions.height)
    })
    if (Config.debug && Config.debugReact) {
      Logger.react(this._fileName, Lifecycle.COMPONENT_WILL_MOUNT)
    }
  }

  onWillFocus(route) {
    this._navigationEventEmitter.emit('onWillFocus' + route.scene.name)
  }

  onDidFocus(route) {
    this._navigationEventEmitter.emit('onDidfocus' + route.scene.name)
  }

  componentDidMount() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._fileName, Lifecycle.COMPONENT_DID_MOUNT)
    }
  }

  componentWillReceiveProps() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._fileName, Lifecycle.COMPONENT_WILL_RECEIEVE_PROPS)
    }
  }

  componentWillUpdate() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._fileName, Lifecycle.COMPONENT_WILL_UPDATE)
    }
  }

  componentDidUpdate() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._fileName, Lifecycle.COMPONENT_DID_UPDATE)
    }
  }

  componentWillUnmount() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._fileName, Lifecycle.COMPONENT_WILL_UNMOUNT)
    }

    // Remove event listeners
    DeviceEventEmitter.removeListener('messageReceived', (message) => this._nativeEventMessageReceived(message))
    DeviceEventEmitter.removeListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))

    // Copy relevant session to storage
    Storage.store("firebaseToken", {
      firebaseToken: Session.getState().firebaseToken
    })
    .then(result => {
      Logger.async("Stored " + "firebaseToken", this._fileName)
    })
    .catch(error => Logger.error(error, this._fileName))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.screenWidth !== this.state.screenWidth) {
      if (nextState.screenWidth > nextState.screenHeight) {
        this.setState({
          orientation: LANDSCAPE
        })
        if (Config.debug) {
          // FIXME
          Logger.error('LANDSCAPE', this._fileName)
        }
      } else {
        this.setState({
          orientation: PORTRAIT
        })
        if (Config.debug) {
          // FIXME
          Logger.error('PORTRAIT', this._fileName)
        }
      }
      return true
    }

    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      return true
    }

    if (JSON.stringify(this.state) !== JSON.stringify(nextState)) {
      return true
    }
    return false
  }

  render() {
    return (
        <Navigator
          initialRoute={this._initialRoute}
          onWillFocus={(route) => this.onWillFocus(route)}
          onDidFocus={(route) => this.onDidFocus(route)}
          renderScene={ (route, navigator) => {
            if (Config.debug && Config.debugNavigator) {
              console.log("--- ROUTES STACK ---")
              console.log(navigator.getCurrentRoutes())
              console.log("--- END ROUTES STACK ---")
            }
            return (
              <View style={{ flex: 1, backgroundColor: Palette.sceneBackgroundColour }}>
                <View onLayout={this._onLayout} style={{flex: 1, backgroundColor: Palette.sceneBackgroundColour }}>
                  {React.createElement(
                    route.scene,
                    {
                      screenWidth: this.state.screenWidth,
                      screenHeight: this.state.screenHeight,
                      screenOrientation: this.state.screenOrientation,
                      route,
                      navigator,
                      _navigationEventEmitter: this._navigationEventEmitter, // Navigator events
                    }
                  )}
                </View>
              </View>
            )
          }}
          configureScene={ (route, routeStack ) =>
            ({
              ...Config.sceneConfig,
              gestures: {} } // Prevents the user from being able to swipe to go back
            )}
        />
    );
  }
}


AppRegistry.registerComponent('Lifekeyrn', () => Lifekeyrn);
