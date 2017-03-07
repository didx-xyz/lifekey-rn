import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native'
import Palette from '../Palette'

export default class OnboardingTextInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      underlineColor: Palette.consentGrayDark
    }
    // style based on OS
  }

  _changeUnderlineColor(e, color) {
    this.setState({ underlineColor: color })
  }

  render() {
    const platformInputStyle = Platform.OS === 'android'
                         ? {} // android
                         : { borderBottomWidth: 1, borderColor: this.state.underlineColor } // ios
    console.log(platformInputStyle)
    return (
      <View style={[style.wrappingView, platformInputStyle]}>
        <TextInput
          ref={input => {this.input = input }}
          onFocus={(e) => this._changeUnderlineColor(e, Palette.consentBlue)}
          onBlur={(e) => this._changeUnderlineColor(e, Palette.consentGrayDark)}
          value={this.props.value}
          style={[{ height: 50, flex: 1, fontSize: 30 }]}
          underlineColorAndroid={ this.state.underlineColor }
        />
      </View>
    )

  }
}


const style = StyleSheet.create({
  wrappingView: {
    flex: 1,
    height: 60,
  }
})