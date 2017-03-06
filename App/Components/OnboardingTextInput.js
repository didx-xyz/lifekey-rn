import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet
} from 'react-native'
import Palette from '../Palette'

export default class OnboardingTextInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      underlineColor: Palette.consentGrayDark
    }

  }

  _changeUnderlineColor(e, color) {
    this.setState({ underlineColor: color })
  }

  render() {
    return (
      <View style={[style.wrappingView]}>
        <TextInput
          ref={input => {this.input = input }}
          onFocus={(e) => this._changeUnderlineColor(e, Palette.consentBlue)}
          onBlur={(e) => this._changeUnderlineColor(e, Palette.consentGrayDark)}
          value={this.props.value}
          style={{ height: 50, flex: 1, fontSize: 30 }}
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