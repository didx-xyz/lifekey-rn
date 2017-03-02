/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import Logger from './Logger'
import * as Lifecycle from './Lifecycle'

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

    Logger.react(this._className, Lifecycle.CONSTRUCTOR)
  }

  componentWillFocus() {
    Logger.react(this._className, Lifecycle.COMPONENT_WILL_FOCUS)
  }

  componentDidFocus() {
    Logger.react(this._className, Lifecycle.COMPONENT_DID_FOCUS)
  }

  componentWillMount() {
    Logger.react(this._className, Lifecycle.COMPONENT_WILL_MOUNT)
  }

  componentDidMount() {
    Logger.react(this._className, Lifecycle.COMPONENT_DID_MOUNT)
  }

  componentWillReceiveProps() {
    Logger.react(this._className, Lifecycle.COMPONENT_WILL_RECEIEVE_PROPS)
  }

  shouldComponentUpdate() {
    Logger.react(this._className, Lifecycle.SHOULD_COMPONENT_UPDATE)

    // Must return true
    return true
  }

  componentWillUpdate() {
    Logger.react(this._className, Lifecycle.COMPONENT_WILL_UPDATE)
  }

  componentDidUpdate() {
    Logger.react(this._className, Lifecycle.COMPONENT_DID_UPDATE)
  }

  componentWillUnmount() {
    Logger.react(this._className, Lifecycle.COMPONENT_WILL_UNMOUNT)

    // Remove event listeners
    this.props._navigationEventEmitter.removeListener('onWillFocus' + this._className, this.componentWillFocus, this)
    this.props._navigationEventEmitter.removeListener('onDidFocus' + this._className, this.componentDidFocus, this)
  }

  render() {
    Logger.react(this._className, Lifecycle.RENDER)
  }
}

Scene.propTypes = {
  navigator: React.PropTypes.object,
  _navigationEventEmitter: React.PropTypes.object,
  _gaTrackers: React.PropTypes.object,
  _modalEventEmitter: React.PropTypes.object
}
