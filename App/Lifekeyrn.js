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
import ConsentConnection from './Models/ConsentConnection'
import ConsentConnectionRequest from './Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from './Models/ConsentDiscoveredUser'
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
    Logger.info(` === ${Config.APP_NAME}  v${Config.version} === `, this.filename)

    // Events
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('messageReceived', (message) => this._nativeEventMessageReceived(message))
      DeviceEventEmitter.addListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))
      // lol

    } else {
      Logger.info('TODO: Firebase iOS', this.filename)
    }

  }

  /**
   * Fires when a Firebase EventMessage is received
   * @param {string} message The firebase message
   */
  _nativeEventMessageReceived(message) {
    if (message.data && message.data.type) {
      switch (message.data.type) {

      case 'received_did':
        ConsentUser.setDid(message.data.did_value)
        break

      case 'user_connection_request':
        ConsentConnectionRequest.add(
          message.data.user_connection_request_id,
          message.data.from_id,
          message.data.from_did,
          message.data.from_nickname
        )
        ConsentDiscoveredUser.add(
          message.data.from_id,
          message.data.from_did,
          message.data.from_nickname
        )
        break

      case 'user_connection_created':
        ConsentConnection.add(
          message.data.user_connection_id,
          message.data.to_id,
          message.data.from_id
        )
        break
      }
    } else {
      // Just a normal notification
      if (message.notification) {
        alert(message.notification.title + ' - ' + message.notification.body)
      } else {
        Logger.error('Unexpeted firebase message format')
      }
    }
  }

  /**
   * Fires when firebase pushes a new token to the device
   * @param {string} token The firebase token
   * @returns {undefined} undefined
   */
  _nativeEventTokenRefreshed(token) {
    Firebase.updateToken(token)
    .catch(error => {
      Logger.firebase(error)
    })
  }

  componentWillMount() {
    Logger.react(this.filename, Lifecycle.COMPONENT_WILL_MOUNT)

    // Get some initial size data
    const width = Math.round(Dimensions.get('window').width)
    const height = Math.round(Dimensions.get('window').height)
    const scale = Dimensions.get('window').scale
    const fontScale = Dimensions.get('window').fontScale
    Logger.info(`Initial Dimensions: ${width} x ${height} ${width < height ? 'PORTRAIT' : 'LANDSCAPE'}`, this.filename)

    // Set to state
    this.setState({
      viewableScreenWidth: width,
      viewableScreenHeight: height,
      orientation: width > height ? LANDSCAPE : PORTRAIT,
      scale: scale,
      fontScale: fontScale
    })
  }

  onWillFocus(route) {
    this._navigationEventEmitter.emit('onWillFocus' + route.scene.name)
  }

  onDidFocus(route) {
    this._navigationEventEmitter.emit('onDidfocus' + route.scene.name)
  }

  componentDidMount() {
    Logger.react(this.filename, Lifecycle.COMPONENT_DID_MOUNT)
    ConsentUser.isRegistered()
    .then(registered => {
      Logger.info('Registere: ' + registered, this.filename)
    })
    .catch(error => {
      Logger.error('Error', this.filename, error)
    })
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
    // Re-render when orientation changes
    if (nextState.viewableScreenWidth !== this.state.viewableScreenWidth ||
        nextState.viewableScreenHeight !== this.state.viewableScreenHeight) {
      return true
    }
    return false
  }

  /**
   * Called when the outermost view's dimensions change
   * @param {Object} event
   * @returns {undefined} undefined
   */
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
                style={{ flex: 1, backgroundColor: Palette.sceneBackgroundColour }}
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
