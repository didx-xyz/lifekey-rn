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
        Logger.info("Keystore detected, setting Session { keyStoreExists: true }", this._fileName)
        Session.update({
          keyStoreExists: true
        })
      } else {
        Logger.info("No keystore detected, setting Session { keyStoreExists: false }", this._fileName)
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
        // ANT - just use everything for now
        Session.update(storage)
      }
      var session = Session.getState()
      if (!session.connections) {
        Session.update({
          connections: {
            user_connection_requests: {},
            user_connections: {}
          }
        })
      }
      return Storage.store(Config.storage.dbKey, Session.getState())

    })
    .catch(error => {
      Logger.error(error, this._fileName)
    })
  }

  _nativeEventMessageReceived(msg) {
    var current_state = Session.getState()
    if (msg.notification) {
      alert(msg.notification.title + ' - ' + msg.notification.body)
    }
    
    if (msg.data.type === 'received_did') {
      Promise.all([
        Session.update({dbDid: msg.data.did_value}),
        Storage.store(Config.storage.dbKey, {dbDid: msg.data.did_value})
      ]).catch((err) => {
        Logger.error('could not persist did value from server', this._fileName)
      })
    }

    if (msg.data.type === 'user_connection_request') {
      var new_connection_request = {
        id: msg.data.user_connection_request_id,
        from_id: msg.data.from_id,
        from_did: msg.data.from_did,
        from_nickname: msg.data.from_nickname
      }
      var new_discovered_user = {
        id: msg.data.from_id,
        did: msg.data.from_did,
        nickname: msg.data.from_nickname
      }
      if (!current_state.users) current_state.users = {}
      if (!current_state.connections) current_state.connections = {}
      if (!current_state.connections.user_connection_requests) {
        current_state.connections.user_connection_requests = {}
      }
      current_state.connections.user_connection_requests[
        msg.data.user_connection_request_id
      ] = new_connection_request
      current_state.users[msg.data.from_id] = new_discovered_user

      Promise.all([
        Session.update(current_state),
        Storage.store(Config.storage.dbKey, current_state)
      ]).then(_ => {
        Logger.async('added a new user connection record')
      }).catch((err) => {
        Logger.error('uh oh, could not persist new user connection request', this._fileName)
      })
    } else if (msg.data.type === 'user_connection_created') {
      var new_connection = {
        id: msg.data.user_connection_id,
        to_id: msg.data.to_id,
        from_id: msg.data.from_id
      }
      if (!current_state.connections) {
        current_state.connections = {}
      }
      if (!current_state.connections.user_connections) {
        current_state.connections.user_connections = {}
      }
      current_state.connections.user_connections[
        msg.data.user_connection_id
      ] = new_connection

      Promise.all([
        Session.update(current_state),
        Storage.store(Config.storage.dbKey, current_state)
      ]).then(_ => {
        Logger.async('added a new user connection record')
      }).catch(err => {
        Logger.error('uh oh, could not persist new user connection request', this._fileName)
      })
    }

  }

  _nativeEventTokenRefreshed(token) {
    if (Config.debug) {
      Logger.firebase("Token refresh event fired")
    }
    // add to Session

    Promise.all([
      Session.update({firebaseToken: token}),
      Storage.store(Config.storage.dbKey, {firebaseToken: token})
    ]).then(_ => {
      console.log('STORED NEW FIREBASE TOKEN')
    }).catch(err => {
      console.log('FIREBASE TOKEN REFRESH ERROR', err)
    })

    const state = Session.getState()

    var pemKey
    if (state.dbUserId) {
      const toSign = Date.now().toString()
      Crypto.loadKeyStore('consent', state.userPassword).then(name => {
        return Crypto.sign(toSign, "private_lifekey", "consent", Crypto.SIG_SHA256_WITH_RSA)
      }).then(sig => {
        return fetch(Config.http.tokenRefreshUrl, {
          method: 'POST',
          body: JSON.stringify({
            device_id: token,
            device_platform: Platform.OS
          }),
          headers: {
            "content-type": "application/json",
            "x-cnsnt-id": state.dbUserId,
            "x-cnsnt-plain": toSign,
            "x-cnsnt-signed": sig.trim()
          }
        })
      }).catch(error => {
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
    DeviceEventEmitter.removeListener('messageReceived', (e) => this._nativeEventMessageReceived(e))
    DeviceEventEmitter.removeListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))
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
                      passProps: route.passProps || {} // allow views to pass data to new views
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
