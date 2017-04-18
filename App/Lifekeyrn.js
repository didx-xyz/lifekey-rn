/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import * as Lifecycle from './Lifecycle'
import Logger from './Logger'
import Palette from './Palette'
import Session from './Session'
import Firebase from './Firebase'
import Routes from './Routes'
import Config from './Config'
import ConsentUser from './Models/ConsentUser'
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
import PropTypes from "prop-types"

const PORTRAIT = 0
const LANDSCAPE = 1

class Lifekeyrn extends Component {
  getChildContext() {
    return {
      // behavior
      "onEditResource": this.onBoundEditResource,
      "onSaveResource": this.onBoundSaveResource,

      // state
      "editResourceForm": () => this.editResourceForm,
      "editResourceId": () => this.editResourceId,
      "clearResourceCache": () => {
        if (this.clearResourceCache) {
          this.clearResourceCache = false
          return true
        }

        return false
      }
    }
  }

  constructor(props) {
    super(props)
    // Members
    this._className = this.constructor.name
    this.filename = this._className + '.js'
    this._navigationEventEmitter = new EventEmitter()
    this._orientationEventEmitter = new EventEmitter()
    this.firebaseInternalEventEmitter = new EventEmitter()
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
      DeviceEventEmitter.addListener(
        'messageReceived',
        (message) => Firebase.messageReceived(message, this.firebaseInternalEventEmitter),
      )
      DeviceEventEmitter.addListener('tokenRefreshed', (token) => this._nativeEventTokenRefreshed(token))
      // lol

    } else {
      Logger.info('TODO: Firebase iOS', this.filename)
    }
    this._initSession()
    this._initialRoute = this._getInitialRoute()
    this.initFirebaseInternal()

    // context behavior
    this.onBoundEditResource = this.onEditResource.bind(this)
    this.onBoundSaveResource = this.onSaveResource.bind(this)

    // context state
    this.clearResourceCache = true
  }

  initFirebaseInternal() {
    this.firebaseInternalEventEmitter.addListener(
      'user_connection_created',
      () => this.navigator.push(Routes.connectionDetails)
    )
    this.firebaseInternalEventEmitter.addListener(
      'app_activation_link_clicked',
      () => this.navigator.push(Routes.main)
    )
  }

  onEditResource(form, id) {
    this.editResourceForm = form
    this.editResourceId = id

    this.navigator.push(Routes.editResource)
  }

  onSaveResource() {
    this.clearResourceCache = true
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
          firebaseToken: results.firebaseToken,
          display_name: results.display_name
        }
        this.setState({
          booted: true
        }, () => {
          Session.update(update)
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
          this.forceUpdate() // probably safe to remove

        })

      }
    })
    .catch(error => {
      Logger.error('Error restoring session', this.filename, error)
    })
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
    this._navigationEventEmitter.emit('onDidFocus' + route.scene.name)
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
    DeviceEventEmitter.removeListener('messageReceived', (message) => this.Firebase.messageReceived(message))
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
          onWillFocus={(route) => this.onWillFocus(route)}
          onDidFocus={(route) => this.onDidFocus(route)}
          ref={(_navigator) => this.navigator = _navigator}
          initialRoute={this._initialRoute}
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

Lifekeyrn.childContextTypes = {
  // behavior
  "onEditResource": PropTypes.func,
  "onSaveResource": PropTypes.func,

  // state
  "editResourceForm": PropTypes.func,
  "editResourceId": PropTypes.func,
  "clearResourceCache": PropTypes.func
}

export default Lifekeyrn
