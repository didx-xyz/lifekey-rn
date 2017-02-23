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

import EventEmitter from 'EventEmitter'
import React, { Component } from 'react';
import {
  View,
  Dimensions,
  AppRegistry,
  Navigator
} from 'react-native';

const PORTRAIT = 0
const LANDSCAPE = 1

export default class Lifekeyrn extends Component {

  constructor(props) {
    super(props)
    console.log("CONST HAPPEN")
    this._fileName = 'index.android.js'
    this._className = this.constructor.name
    this._initialRoute = Config.initialRoute
    this._navigationEventEmitter = new EventEmitter()
    this.state = {
      orientation: null,
      screenWidth: null,
      screenHeight: null
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

  componentWillUnmount() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._fileName, Lifecycle.COMPONENT_WILL_UNMOUNT)
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
              gestures: {}} // Prevents the user from being able to swipe to go back
            )}
        />
    );
  }
}


AppRegistry.registerComponent('Lifekeyrn', () => Lifekeyrn);
