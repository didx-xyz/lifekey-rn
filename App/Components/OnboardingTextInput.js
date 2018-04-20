import React, { Component } from 'react'

import {
  View,
  TextInput,
  StyleSheet,
  Animated
} from 'react-native'

import Touchable from './Touchable'
import Palette from '../Palette'
import Svg, { Path } from 'react-native-svg'
import { Integer } from 'tcomb';

export default class OnboardingTextInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      underlineColor: Palette.consentGrayDark,
      buttonVisible: false,
      cap: false,
      fadeAnim: new Animated.Value(0)
    }

    this._focus = this._focus.bind(this)
    this._blur = this._blur.bind(this)
  }

  _focus() {
    Animated.timing(
      this.state.fadeAnim,
      { toValue: 1 }
    ).start()

    this.setState({
      underlineColor: Palette.consentBlue,
      buttonVisible: true,
      cap: true
    })
  }

  _blur() {
    Animated.timing(
      this.state.fadeAnim,
      { toValue: 0 }
    ).start()

    this.setState({
      underlineColor: Palette.consentGrayDark,
      buttonVisible: false,
      cap: false
    })
  }

  _onChangeText(text) {
    if(text.length % 10 == 0){
    let fontsize =  this.props.fontSize;
    fontsize -= (Integer)(text.length / 10);
    this.setState({ fontSize: fontsize });
    }
    this.props.onChangeText(text);
  }

  render() {
    return (
      <Animated.View
        style={[style.wrappingView, {
          borderBottomColor: this.state.underlineColor, opacity: this.props.inputFadeTransitionValue
        }]}>
        <View style={{ flex: 6 }}>
          <TextInput
            ref={input => {this._input = input }}
            onFocus={this._focus}
            onBlur={this._blur}
            onChangeText={ text => this._onChangeText(text)}
            value={this.props.value}
            style={[{
              flex: 1,
              fontSize: this.props.fontSize
            }, {fontSize : this.state.fontSize}]}
            autoCapitalize={this.props.autoCapitalize}
            underlineColorAndroid="transparent"
            scrollEnabled={false}
            onSubmitEditing={() => this.props.onSubmit()}
            returnKeyValue="done"
          />
        </View>
        <Touchable style={{ width: 50, height: 50 }}
          onPress={() => {
            if (this.state.buttonVisible) {
              this.props.onSubmit()
            }
          }}
        >
          <Animated.View
            style={{ flex: 1, width: 100, height: 100, alignItems: 'center', justifyContent: 'center', opacity: this.state.fadeAnim }}>
            <Svg height="31" width="31" >
              <Path
                d="M30,0C13.4 0 0 13.4 0 30c0 16.6 13.4 30 30 30c16.6 0 30-13.4 30-30C60 13.4 46.6 0 30 0z M39.8 30.4 L25.6 44.6c-0.2 0.2-0.5 0.3-0.7 0.3s-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1 0-1.4l13.5-13.5l-13-13c-0.4-0.4-0.4-1 0-1.4 c0.4-0.4 1-0.4 1.4 0L39.8 29C40.2 29.4 40.2 30.1 39.8 30.4z"
                fill={ Palette.consentBlue }
                scale={0.5}
              />
            </Svg>
          </Animated.View>
        </Touchable>
      </Animated.View>
    )
  }
}

const style = StyleSheet.create({
  wrappingView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    borderBottomWidth: 1,
  }
})
