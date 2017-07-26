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
import FirebaseHandler from './FirebaseHandler'
import EventEmitter from 'EventEmitter'
import React, { Component } from 'react'
import Firebase from 'react-native-firebase'
import {
  View,
  Dimensions,
  Navigator,
  Platform,
  StatusBar,
  ToastAndroid
} from 'react-native'
import PropTypes from "prop-types"

const PORTRAIT = 0
const LANDSCAPE = 1

// These are fed to the help page. They contain orientating info and pics for a new user. 
const orientationScreens = [
  { "image": require("./Images/onboarding_test.png"), "heading": "Identify", "copy": "Qi Identity is my digital passport" }, 
  { "image": require("./Images/qr.png"), "heading": "Connect", "copy": "Qi Code connects me in a snap & replaces paperwork" }, 
  { "image": require("./Images/phone.png"), "heading": "Access", "copy": "Qi Access magically logs me in without usernames & passwords" }, 
  { "image": require("./Images/share.png"), "heading": "Secure", "copy": "Qi Safe secures my personal information under my control" }, 
  { "image": require("./Images/rewards.png"), "heading": "Rewards", "copy": "Qi Rewards give me Thanks Points and personalised offers" }
]

class Lifekeyrn extends Component {
  getChildContext() {
    return {
      // behavior
      "onEditResource": this.onBoundEditResource,
      "onSaveResource": this.onBoundSaveResource,
      "onDeleteResource": this.onBoundDeleteResource,
      "onSetModalVisible": this.onSetModalVisible,

      // state
      "getEditResourceForm": this.boundGetEditResourceForm,
      "getEditResourceId": this.boundGetEditResourceId,
      "getEditResourceName": this.boundGetEditResourceName,
      "getModalVisible": this.boundGetModalVisible,
      "getShouldClearResourceCache": this.boundGetShouldClearResourceCache,
      "userHasActivated": this.boundUserHasActivated
    }
  }

  constructor(props) {
    super(props)
    // Members
    this._className = this.constructor.name
    this.filename = this._className + '.js'
    this._firebase = new Firebase
    this._messaging = this._firebase.messaging()
    this.firebaseInternalEventEmitter = new EventEmitter()
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
      fontScale: null,
      userHasActivatedCallback: null
    }
    Logger.info(` === ${Config.APP_NAME}  v${Config.version} === `, this.filename)

    // Events
    if (Platform.OS === 'android') {
      this._messaging.onTokenRefresh(this._nativeEventTokenRefreshed)
      this._messaging.onMessage(
        FirebaseHandler.messageReceived.bind(
          FirebaseHandler,
          this.firebaseInternalEventEmitter
        )
      )
    } else {
      Logger.info('TODO: Firebase iOS', this.filename)
    }

    this._initSession()
    this.initFirebaseHandlerEvents()
    this._initialRoute = this._getInitialRoute()

    // context behavior
    this.onBoundEditResource = this.onEditResource.bind(this)
    this.onBoundSaveResource = this.onSaveResource.bind(this)
    this.onBoundDeleteResource = this.onDeleteResource.bind(this)
    this.onSetModalVisible = this.setModalVisible.bind(this)

    // context state
    this.shouldClearResourceCache = true
    this.editResourceForm = null
    this.editResourceId = null
    this.editResourceName = null
    this.modalVisible = false
    this.boundGetEditResourceForm = this.getEditResourceForm.bind(this)
    this.boundGetEditResourceId = this.getEditResourceId.bind(this)
    this.boundGetEditResourceName = this.getEditResourceName.bind(this)
    this.boundGetModalVisible = this.getModalVisible.bind(this)
    this.boundGetShouldClearResourceCache = this.getShouldClearResourceCache.bind(this)
    this.boundUserHasActivated = this.userHasActivated.bind(this)
  }

  getEditResourceForm() {
    return this.editResourceForm
  }

  getEditResourceId() {
    return this.editResourceId
  }

  getEditResourceName() {
    return this.editResourceName
  }

  getShouldClearResourceCache() {
    if (this.shouldClearResourceCache) {
      this.shouldClearResourceCache = false
      return true
    }
    return false
  }

  userHasActivated(callback) {
    
    if (this.state.userHasActivatedCallback && typeof this.state.userHasActivatedCallback === "function") {
      console.log("Calling given callback from state: ", this.state.userHasActivatedCallback )
      this.state.userHasActivatedCallback()
    }
    else{
      this.setState({ "userHasActivatedCallback": callback })
    }
  }

  onEditResource(form, id, name) {

    console.log("GOT TO CONTEXT EDIT")

    this.editResourceForm = form
    this.editResourceId = id
    this.editResourceName = name

    if(form === "http://schema.cnsnt.io/public_profile_form")
      this.navigator.push(Routes.editProfile)
    else
      this.navigator.push(Routes.editResource)
  }

  setModalVisible(value){
    console.log("Context set modal: ", value)
    this.modalVisible = value
  }
  getModalVisible(){
    console.log("Context get modal: ", this.modalVisible)
    return !!this.modalVisible
  }

  onSaveResource() {
    this.shouldClearResourceCache = true
  }

  onDeleteResource(){
    

    const id = this.getEditResourceId()

    if(!id) return

    console.log("CONTEXT RESOURCE DELETE: ", id)

    ConsentUser.setPendingState(id, 'pendingDelete')
    Api.deleteResource({ id })
       .then(() => {
        ConsentUser.removeFromState(id)
        this.navigator.popToRoute(Routes.me)
        ToastAndroid.show('Resource deleted...', ToastAndroid.LONG)
       })
       .catch(error => {
        ToastAndroid.show('Failed to delete resource...', ToastAndroid.LONG)
        Logger.warn('Could not delete resource: ', error)
       })
  }

  _getInitialRoute() {
    if (Config.initialRouteFromConfig) return Config.initialRoute
    
    const sessionState = Session.getState()
    const userState = sessionState.user

    console.log("INITIAL SESSION STATE: ", sessionState)
    console.log("INITIAL USERSTATE: ", userState)

    return (
      userState && userState.registered ?
      Routes.onboarding.unlock :
      Routes.onboarding.splashScreen
    )
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
        })
      }
    })
    .catch(error => {
      Logger.error('Error restoring session', this.filename, error)
    })
  }

  initFirebaseHandlerEvents() {
    this.firebaseInternalEventEmitter.addListener(
      'user_connection_created',
      () => {
        ToastAndroid.show('Connection created', ToastAndroid.SHORT)
      }
    )
    this.firebaseInternalEventEmitter.addListener(
      'user_connection_request',
      () => {
        ToastAndroid.show('Connection requested', ToastAndroid.SHORT)
      }
    )
    this.firebaseInternalEventEmitter.addListener(
      'received_did',
      () => {
        console.log("LIFEKEYRN: received_did event")
        this.setState({ "userDidPresent" : true }, this.checkDidAndActivation)
      }
    )
    this.firebaseInternalEventEmitter.addListener(
      'app_activation_link_clicked',
      () => {
        console.log("LIFEKEYRN: userHasActivated event")
        this.setState({ "userHasActivated" : true }, this.checkDidAndActivation)
      }
    )
    this.firebaseInternalEventEmitter.addListener(
      'information_sharing_agreement_request',
      (message) => {}
    )

    this.firebaseInternalEventEmitter.addListener(
      'webauth_failure',
      (message) => {
        ToastAndroid.show('WEB AUTH FAILURE: ' + message + " | " + message.webauth_failure_type)
      }
    )
  }

  // Check for the existence of a DID and that the user has activated, if so then navigate to main. 
  checkDidAndActivation(did, activation) {

    console.log("checkDidAndActivation callback: did => ", this.state.userDidPresent, " | activated => ", this.state.userHasActivated)

    if(this.state.userDidPresent && this.state.userHasActivated){
      // this.navigator.push(Routes.helpScreens)
      this.navigator.resetTo({...Routes.helpGeneral, "destination": "main", "screens": orientationScreens, "navigationType": "resetTo" })
    }
    else if(this.state.userHasActivated){
      this.userHasActivated(null)
    }
  }

  /**
   * Fires when firebase pushes a new token to the device
   * @param {string} token The firebase token
   * @returns {undefined} undefined
   */
  _nativeEventTokenRefreshed(token) {
    ConsentUser.setToken(
      token
    ).catch(
      Logger.firebase
    )
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
                <StatusBar hidden={false} />
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
                    firebaseInternalEventEmitter: this.firebaseInternalEventEmitter,
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
  "onDeleteResource": PropTypes.func,
  "onSetModalVisible": PropTypes.func,

  // state
  "getEditResourceForm": PropTypes.func,
  "getEditResourceId": PropTypes.func,
  "getEditResourceName": PropTypes.func,
  "getModalVisible": PropTypes.func,
  "getShouldClearResourceCache": PropTypes.func,

  "userHasActivated": PropTypes.func
}

export default Lifekeyrn
