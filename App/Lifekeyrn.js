/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import * as Lifecycle from './Lifecycle'
import Logger from './Logger'
import Crypto from './Crypto'
import Palette from './Palette'
import Session from './Session'
import Storage from './Storage'
import Config from './Config'
import Firebase from './Firebase'
// import ConsentKeystore from './Models/ConsentKeystore'
import ConsentUser from './Models/ConsentUser'
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
    this.filename = this._className + '.js'
    this._initialRoute = Config.initialRoute
    this._navigationEventEmitter = new EventEmitter()
    this._orientationEventEmitter = new EventEmitter()
    this.state = {
      orientation: null,
      viewableScreenWidth: null,
      viewableScreenHeight: null
    }
    Logger.info(`Booting ReactNative ${Config.APP_NAME}  ${Config.version}`, this.filename)

    // Events
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('messageReceived', (message) => this._nativeEventMessageReceived(message))
      DeviceEventEmitter.addListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))
      // lol
      Firebase.getToken()
      .then(token => {
        Logger.firebase(`Token loaded: ${token}`)
      })
      .catch(error => {
        Logger.error('Could not load Firebase token', this.filename, error)
      })
    } else {
      Logger.info('TODO: Firebase iOS', this.filename)
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
      Logger.error(error, this.filename)
    })

    // Init connections session
    if (!Session.getState().connections) {
      Session.update({
        connections: {
          userConnectionRequests: {},
          userConnections: {}
        }
      })
    }
  }

  /**
   * Fires when a Firebase EventMessage is received
   */
  _nativeEventMessageReceived(msg) {
    var current_state = Session.getState()
    if (msg.notification) {
      alert(msg.notification.title + ' - ' + msg.notification.body)
    }

    if (msg.data.type === 'received_did') {
      Session.update({ dbDid: msg.data.did_value })
      Storage.store(Config.storage.dbKey, { dbDid: msg.data.did_value })
      .catch((err) => {
        Logger.error('could not persist did value from server', this.filename)
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


      Session.update(current_state),
      Storage.store(Config.storage.dbKey, current_state)
      .then(() => {
        Logger.async('added a new user connection record')
      })
      .catch(error => {
        Logger.error('uh oh, could not persist new user connection request', this.filename, error)
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

      Session.update(current_state),
      Storage.store(Config.storage.dbKey, current_state)
      .then(() => {
        Logger.async('added a new user connection record')
      })
      .catch(error => {
        Logger.error('uh oh, could not persist new user connection request', this.filename, error)
      })
    }

  }

  /**
   * Fires when firebase pushes a new token to the device
   * @param {string} token The firebase token
   */
  _nativeEventTokenRefreshed(token) {
    Firebase.updateToken(token)
    .catch(error => {
      Logger.error('Firebase error', this.filename, error)
    })

    const state = Session.getState()

    var pemKey
    if (state.dbUserId) {

      // This should be something random
      const toSign = Date.now().toString()

      Crypto.loadKeyStore(Config.keyStoreName, state.userPassword)
      .then(name => {
        return Crypto.sign(
          toSign,                     // dataString
          'private_lifekey',          // privateKeyAlias
          'consent',                  // privateKeyPassword
          Crypto.SIG_SHA256_WITH_RSA  // algorithm
        )
      })
      .then(sig => {
        return fetch(`${Config.http.baseUrl}/management/device`, {
          method: 'POST',
          body: JSON.stringify({
            device_id: token,
            device_platform: Platform.OS
          }),
          headers: {
            'content-type': 'application/json',
            'x-cnsnt-id': state.dbUserId,
            'x-cnsnt-plain': toSign,
            'x-cnsnt-signed': sig.trim()
          }
        })
      })
      .catch(error => {
        alert("Could not update token")
        Logger.error(error, this.filename)
      })

    }
  }

  componentWillMount() {
    const width = Math.round(Dimensions.get('window').width)
    const height = Math.round(Dimensions.get('window').height)
    const scale = Dimensions.get('window').scale
    const fontScale = Dimensions.get('window').fontScale

    Logger.info(`Initial Dimensions: ${width} x ${height} ${width < height ? 'PORTRAIT' : 'LANDSCAPE'}`, this.filename)
    this.setState({
      viewableScreenWidth: width,
      viewableScreenHeight: height,
      orientation: width > height ? LANDSCAPE : PORTRAIT,
      scale: scale,
      fontScale: fontScale
    })
    Logger.react(this.filename, Lifecycle.COMPONENT_WILL_MOUNT)
  }

  onWillFocus(route) {
    this._navigationEventEmitter.emit('onWillFocus' + route.scene.name)
  }

  onDidFocus(route) {
    this._navigationEventEmitter.emit('onDidfocus' + route.scene.name)
  }

  componentDidMount() {
    Logger.react(this.filename, Lifecycle.COMPONENT_DID_MOUNT)

    // Check if keystore exists
    if (Platform.OS === 'android') {
      ConsentUser.isRegistered()
      .catch(error => Logger.error('Error detecting keystore', this.filename, error))
    } else {
      // TODO: iOS
      Logger.info('TODO: iOS support for keystore', this.filename)
    }
  }

  componentWillReceiveProps() {
    Logger.react(this.filename, Lifecycle.COMPONENT_WILL_RECEIEVE_PROPS)
  }

  componentWillUpdate(nextProps, nextState) {
    Logger.react(this.filename, Lifecycle.COMPONENT_WILL_UPDATE)
  }

  componentDidUpdate() {
    Logger.react(this.filename, Lifecycle.COMPONENT_DID_UPDATE)
  }

  componentWillUnmount() {
    Logger.react(this.filename, Lifecycle.COMPONENT_WILL_UNMOUNT)

    // Remove event listeners
    DeviceEventEmitter.removeListener('messageReceived', (e) => this._nativeEventMessageReceived(e))
    DeviceEventEmitter.removeListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.viewableScreenWidth !== this.state.viewableScreenWidth ||
        nextState.viewableScreenHeight !== this.state.viewableScreenHeight) {
      return true
    }
    return false
  }

  onScreenUpdate(event) {
    const width = Math.round(event.nativeEvent.layout.width)
    const height = Math.round(event.nativeEvent.layout.height)
    const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT'
    if (orientation !== this.state.orientation) {
      // emit orientation change event
      this._orientationEventEmitter.emit('orientation')
    }
    if (this.state.viewableScreenHeight !== height ||
        this.state.viewableScreenWidth !== width) {
      this.setState({
        viewableScreenWidth: width,
        viewableScreenHeight: height,
        orientation: orientation
      })
      Logger.info(`Screen redraw: ${width} x ${height} ${orientation}`, this.filename)
    }
  }

  render() {
    return (
        <Navigator

          initialRoute={this._initialRoute}
          onWillFocus={(route) => this.onWillFocus(route)}
          onDidFocus={(route) => this.onDidFocus(route)}
          renderScene={ (route, navigator) => {
            Logger.routeStack(navigator.getCurrentRoutes())
            return (
              <View
                onLayout={(event) => this.onScreenUpdate(event)}
                style={{
                  flex: 1,
                  backgroundColor: Palette.sceneBackgroundColour
                }}
              >
                {React.createElement(
                  route.scene,
                  {
                    screenWidth: this.state.viewableScreenWidth,
                    screenHeight: this.state.viewableScreenHeight,
                    screenOrientation: this.state.screenOrientation,
                    scale: this.state.scale,
                    fontScale: this.state.fontScale,
                    route,
                    navigator,
                    _navigationEventEmitter: this._navigationEventEmitter, // Navigator events
                    passProps: route.passProps || {} // allow views to pass data to new views
                  }
                )}
              </View>
            )
          }}
          configureScene={ () =>
            ({
              ...Config.sceneConfig,
              gestures: {} // Prevents the user from being able to swipe to go back
            })
          }
        />
    );
  }
}
