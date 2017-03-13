import AndroidBackButton from 'react-native-android-back-button'
import React, { Component } from 'react'
class BackButton extends Component {
  constructor(...params) {
    super(...params)
    this._handlePress = this._handlePress.bind(this)
  }

  _handlePress() {
    if (this.props.onPress) {
      return this.props.onPress()
    }

    const navigator = this.props.navigator
    navigator.pop.call(navigator)

    return true
  }

  render() {
    return (
      <AndroidBackButton onPress={this._handlePress} />
    )
  }
}

export default BackButton
