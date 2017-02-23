/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import Logger from './Logger'
import * as Lifecycle from './Lifecycle'
import Config from './Config'
import { DeviceEventEmitter } from 'react-native'
/**
 * Scene Component - A component that extends the functionality of React.Component
 */
export default class Scene extends Component {

  constructor(props) {
    super(props)
    this._fileName = this.constructor.name + '.js'
    this._className = this.constructor.name

    this.navigator = this.props.navigator
    this.props._navigationEventEmitter.addListener('onWillFocus' + this._className, this.componentWillFocus, this)
    this.props._navigationEventEmitter.addListener('onDidFocus' + this._className, this.componentDidFocus, this)
    // this.props._deviceEventEmitter.addListener("nativeEvent", this._nativeEvent, this)

    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.CONSTRUCTOR)
    }
  }

  componentWillFocus() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.COMPONENT_WILL_FOCUS)
    }
  }

  componentDidFocus() {
    if (Config.debug) {
      if (Config.debugReact) {
        Logger.react(this._className, Lifecycle.COMPONENT_DID_FOCUS)
      }
    }
  }

  componentWillMount() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.COMPONENT_WILL_MOUNT)
    }
  }

  componentDidMount() {
    if (Config.debug) {
      if (Config.debugReact) {
        Logger.react(this._className, Lifecycle.COMPONENT_DID_MOUNT)
      }
    }
  }

  componentWillReceiveProps() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.COMPONENT_WILL_RECEIEVE_PROPS)
    }
  }

  shouldComponentUpdate() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.SHOULD_COMPONENT_UPDATE)
    }

    // Must return true
    return true
  }

  componentWillUpdate() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.COMPONENT_WILL_UPDATE)
    }
  }

  componentDidUpdate() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.COMPONENT_DID_UPDATE)
    }
  }

  componentWillUnmount() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.COMPONENT_WILL_UNMOUNT)
    }

    // Remove event listeners
    this.props._navigationEventEmitter.removeListener('onWillFocus' + this._className, this.componentWillFocus, this)
    this.props._navigationEventEmitter.removeListener('onDidFocus' + this._className, this.componentDidFocus, this)
  }

  render() {
    if (Config.debug && Config.debugReact) {
      Logger.react(this._className, Lifecycle.RENDER)
    }
  }
}

Scene.propTypes = {
  navigator: React.PropTypes.object,
  _navigationEventEmitter: React.PropTypes.object,
  _gaTrackers: React.PropTypes.object,
  _modalEventEmitter: React.PropTypes.object
}
