/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import {
  Config,
  Palette
} from '.'

import * as Lifecycle from './Lifecycle'
import Logger from './Logger'
import Crypto from './Crypto'
import Session from './Session'
import Storage from './Storage'

import EventEmitter from 'EventEmitter'
import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Navigator,
  DeviceEventEmitter,
  Platform
} from 'react-native'

const PORTRAIT = 0
const LANDSCAPE = 1

export default class Lifekeyrn extends Component {

  constructor(...params) {
    super(...params)
    // Members
    this._className = this.constructor.name
    this._fileName = this._className + '.js'
    this._initialRoute = Config.initialRoute
    this._navigationEventEmitter = new EventEmitter()
    this.state = {
      orientation: null,
      viewableScreenWidth: null,
      viewableScreenHeight: null
    }
    Logger.info('Booting ReactNative ' + Config.appName + ' ' + Config.version, this._fileName)

    // Events
    if (Platform.OS === "android") {
        DeviceEventEmitter.addListener('messageReceived', (e) => this._nativeEventMessageReceived(e))
        DeviceEventEmitter.addListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))

        // Check for keystore
        Crypto.getKeyStoreList()
        .then(list => {
          if (list.find(x => x === Config.keyStoreName)) {
            Logger.info('Keystore detected', this._fileName)
            Session.update({ keyStoreExists: true })
          } else {
            Logger.info('No keystore detected', this._fileName)
            Session.update({ keyStoreExists: false })
          }
        })
        .catch(error => {
          Logger.error(error, this._fileName)
        })
    } else {
      Session.update({ keyStoreExists: false })
    }

    // Load Firebase token from storage
    Storage.load(Config.storage.dbKey)
    .then(storage => {
      if (storage === null) {
        // enoent
        Logger.async(Config.storage.dbKey + 'not found. No persistent app storage found')
      } else {
        Session.update({ firebaseToken: storage.firebaseToken })
      }
      return Storage.store(Config.storage.dbKey, Session.getState())
    })
    .catch(error => {
      Logger.error(error, this._fileName)
    })

    // Init connections session
    if (!Session.getState().connections) {
      Session.update({
        connections: {
          userConnectionRequets: {},
          userConnections: {}
        }
      })
    }
  }

  _nativeEventMessageReceived(msg) {
    var current_state = Session.getState()
    if (msg.notification) {
      alert(msg.notification.title + ' - ' + msg.notification.body)
    }

    if (msg.data.type === 'received_did') {
      Promise.all([
        Session.update({ dbDid: msg.data.did_value }),
        Storage.store(Config.storage.dbKey, { dbDid: msg.data.did_value })
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
      current_state.connections.user_connection_requests[msg.data.user_connection_request_id] = new_connection_request
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
      Logger.firebase('STORED NEW FIREBASE TOKEN', this._fileName)
    }).catch(err => {
      Logger.firebase(err, this._fileName)
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
      viewableScreenWidth: Math.round(initialDimensions.width),
      viewableScreenHeight: Math.round(initialDimensions.height)
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
    Logger.react(this._fileName, Lifecycle.COMPONENT_DID_MOUNT)
  }

  componentWillReceiveProps() {
    Logger.react(this._fileName, Lifecycle.COMPONENT_WILL_RECEIEVE_PROPS)
  }

  componentWillUpdate(nextProps, nextState) {
    Logger.react(this._fileName, Lifecycle.COMPONENT_WILL_UPDATE)
  }

  componentDidUpdate() {
    Logger.react(this._fileName, Lifecycle.COMPONENT_DID_UPDATE)
  }

  componentWillUnmount() {
    Logger.react(this._fileName, Lifecycle.COMPONENT_WILL_UNMOUNT)

    // Remove event listeners
    DeviceEventEmitter.removeListener('messageReceived', (e) => this._nativeEventMessageReceived(e))
    DeviceEventEmitter.removeListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.screenWidth !== this.state.viewableScreenWidth) {
      if (nextState.screenWidth > nextState.screenHeight) {
        this.setState({ orientation: LANDSCAPE })
        Logger.info('LANDSCAPE', this._fileName)
      } else {
        this.setState({ orientation: PORTRAIT })

        Logger.info('PORTRAIT', this._fileName)
      }
      return true
    }
    return false
  }

  _onLayout(event) {
    const width = Math.round(event.nativeEvent.layout.width)
    const height = Math.round(event.nativeEvent.layout.height)
    this.setState({
      viewableScreenWidth: width,
      viewableScreenHeight: height,
      orientation: width > height ? LANDSCAPE : PORTRAIT
    })
    Logger.info("onLayout " + width + " " + height + " " + (width > height ? LANDSCAPE : PORTRAIT), this._fileName)
  }

  render() {
    return (
        <Navigator
          onLayout={(event) => this._onLayout(event)}
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
                <View style={{ flex: 1, backgroundColor: Palette.sceneBackgroundColour }}>
                  {React.createElement(
                    route.scene,
                    {
                      screenWidth: this.state.viewableScreenWidth,
                      screenHeight: this.state.viewableScreenHeight,
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
              gestures: {} // Prevents the user from being able to swipe to go back
            })
          }
        />
    );
  }
}
