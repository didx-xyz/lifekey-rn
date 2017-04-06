// external dependencies
import React, { Component } from "react"
import AndroidBackButton from "react-native-android-back-button"

class BackButton extends Component {
  constructor(...params) {
    super(...params)

    this.onPress = this.onPress.bind(this)
  }

  onPress() {
    if (this.props.onPress) {
      return this.props.onPress()
    }

    const navigator = this.props.navigator
    navigator.pop.call(navigator)

    return true
  }

  render() {
    return (
      <AndroidBackButton onPress={this.onPress} />
    )
  }
}

BackButton.propTypes = {
  "onPress": React.PropTypes.func
}

export default BackButton
