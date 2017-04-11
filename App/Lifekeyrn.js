/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import * as Lifecycle from './Lifecycle'
import Logger from './Logger'
import Palette from './Palette'
import Api from './Api'
import Session from './Session'
import Routes from './Routes'
import Config from './Config'
import ConsentUser from './Models/ConsentUser'
import ConsentConnection from './Models/ConsentConnection'
import ConsentConnectionRequest from './Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from './Models/ConsentDiscoveredUser'
import ConsentISA from './Models/ConsentISA'
import EventEmitter from 'EventEmitter'
import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Navigator,
  DeviceEventEmitter,
  Platform,
  StatusBar
} from 'react-native'

const PORTRAIT = 0
const LANDSCAPE = 1

export default class Lifekeyrn extends Component {

  constructor(props) {
    super(props)
    // Members
    this._className = this.constructor.name
    this.filename = this._className + '.js'
    this._navigationEventEmitter = new EventEmitter()
    this._orientationEventEmitter = new EventEmitter()
    this.state = {
      booted: false,
      orientation: null,
      viewableScreenWidth: null,
      viewableScreenHeight: null,
      screenWidth: null,
      screenHeight: null,
      scale: null,
      fontScale: null
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
    this._initSession()
    this._initialRoute = this._getInitialRoute()

  }

  _getInitialRoute() {
    if (Config.initialRouteFromConfig) {
      return Config.initialRoute
    } else {
      const userState = Session.getState().user

      if (!userState || !userState.registered) {
        return Routes.onboarding.splashScreen
      } else {
        return Routes.onboarding.unlock
      }
    }
  }

  _initSession() {
    Logger.info('Initialising session', this.filename)
    // We want to essentially look through storage
    // to determine the starting point of global state
    ConsentUser.get()
    .then(results => {
      if (results) {
        const update = {}
        update[ConsentUser.storageKey] = {
          id: results.id,
          did: results.did,
          registered: results.registered || false,
          loggedIn: results.loggedIn || false,
          email: results.email,
          firebaseToken: results.firebaseToken
        }
        this.setState({
          booted: true
        }, () => {
          Session.update(update)
          this.forceUpdate()
        })

      } else {
        const update = {}
        update[ConsentUser.storageKey] = {
          registered: false,
          loggedIn: false,
        }

        this.setState({
          booted: true
        }, () => {
          Session.update(update)
          console.log('BOOTED TRUE')
          this.forceUpdate()

        })

      }
    })
    .catch(error => {
      Logger.error('Error restoring session', this.filename, error)
    })
  }

  /**
   * Fires when a Firebase EventMessage is received
   * @param {string} message The firebase message
   */
  _nativeEventMessageReceived(message) {
    Logger.info('Firebase message received', this.filename)
    console.log(JSON.stringify(message))

    if (message.data && message.data.type) {
      switch (message.data.type) {

      case 'received_did':
        Logger.firebase('received_did')
        ConsentUser.setDid(message.data.did_value)
        .then(did => {
          Logger.info(`DID set to ${did}`, this.filename)
        })
        .catch(error => {
          Logger.error('Could not set DID', this.filename, error)
        })
        break

      case 'user_connection_request':
        Logger.firebase('user_connection_request')
        ConsentConnectionRequest.add(
          message.data.user_connection_request_id,
          message.data.from_id,
          message.data.from_did,
          message.data.from_nickname
        )
        .then(connectionRequests => {
          Logger.firebase('ConsentConnectionRequest updated')
          console.log(connectionRequests)
        })
        .catch(error => {
          Logger.error('Error writing to ConsentConnectionRequest', this.filename, error)
        })
        ConsentDiscoveredUser.add(
          message.data.from_id,
          message.data.from_did,
          message.data.from_nickname
        )
        .then(discoveredUsers => {
          Logger.firebase("ConsentDiscoveredUser updated")
          console.log(discoveredUsers)
        })
        .catch(error => {
          Logger.error('Error writing to ConsentDiscoveredUser ')
        })
        break

      case 'user_connection_created':
        Logger.firebase('user_connection_created')
        ConsentConnection.add(
          message.data.user_connection_id,
          message.data.to_id
        )
        .then(() => {
          Logger.info('Connection created')
          this.forceUpdate()
          Logger.info('Force update')
        })
        .catch(error => {
          Logger.error(error, this.filename, error)
        })
        break
      case 'sent_activiation_email':
        Logger.firebase('sent_activiation_email')
        alert(`${message.notification.title} - ${message.notification.body}`)
        break
      case 'app_activation_link_clicked':
        Logger.firebase('app_activation_link_clicked')
        this.navigator.replace(Routes.main)
        break
      case 'information_sharing_agreement_request':
        Logger.firebase('information_sharing_agreement_request')
        ConsentISA.add(
          message.data.isar_id,
          message.data.from_id
        )
        .then(() => {
          Logger.info('ISA Added')
        })
        .catch(error => {
          Logger.error(error, this.filename, error)
        })
        break
      default:
        Logger.firebase(JSON.stringify(message))
        if (message.notification) {
          Logger.info(message.notification.title + ' - ' + message.notification.body, this.filename)
        }
        break
      }

    } else {
      // Just a normal notification
      if (message.notification) {
        Logger.firebase(JSON.stringify(message))
      } else {
        Logger.error('Unexpected firebase message format')
      }
    }
  }

  /**
   * Fires when firebase pushes a new token to the device
   * @param {string} token The firebase token
   * @returns {undefined} undefined
   */
  _nativeEventTokenRefreshed(token) {
    ConsentUser.setToken(token)
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
    Logger.info(`Screen Dimensions: ${width} x ${height} ${width < height ? 'PORTRAIT' : 'LANDSCAPE'}`, this.filename)

    // Set to state
    this.setState({
      screenWidth: width,
      screenHeight: height,
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
  _onScreenUpdate(event) {

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
      Logger.info(`Usable screen: ${width} x ${height} ${orientation}`, this.filename)
    }
  }


  render() {
    return (
        <Navigator
          ref={(_navigator) => this.navigator = _navigator}
          initialRoute={this._initialRoute}
          onWillFocus={(route) => this.onWillFocus(route)}
          onDidFocus={(route) => this.onDidFocus(route)}
          renderScene={ (route, navigator) => {
            Logger.routeStack(navigator.getCurrentRoutes())
            return (
              <View
                onLayout={(event) => this._onScreenUpdate(event)}
                style={{ flex: 1, backgroundColor: Palette.sceneBackgroundColour }}
              >
                <StatusBar hidden={true} />
                {React.createElement(
                  route.scene,
                  {
                    booted: this.state.booted,
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
