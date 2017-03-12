/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import Palette from '../Palette'
import Svg, { Path } from 'react-native-svg'

export default class OnboardingTextInputAndroid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      underlineColor: Palette.consentGrayDark,
      buttonVisible: false,
      cap: false,
      fadeAnim: new Animated.Value(0)
    }
    // style based on OS
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

  render() {
    return (
      <View
        style={[style.wrappingView, {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          borderBottomWidth: 1,
          borderBottomColor: this.state.underlineColor
        }]}>
        <View style={{ flex: 6 }}>
          <TextInput
            ref={input => {this._input = input }}
            onFocus={() => this._focus()}
            onBlur={() => this._blur()}
            onChangeText={text => this.props.onChangeText(text)}
            value={this.props.value}
            style={[{
              flex: 1,
              fontSize: 30,

            }]}
            underlineColorAndroid="transparent"
            scrollEnabled={false}
            onSubmitEditing={() => this.props.onSubmit()}
            returnKeyValue="done"
          />
        </View>
        <TouchableWithoutFeedback style={{ width: 50, height: 50, backgroundColor: 'green' }} onPress={() => this.props.onSubmit()}>
          <Animated.View style={{
            flex: 1,
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: this.state.fadeAnim
          }} >
              <Svg style={{
                marginLeft: 50, // or it will only draw half,
                marginTop: 25,
                width: 100,
                height: 100
              }} height="100" width="100">
                <Path
                  d="M30,0C13.4 0 0 13.4 0 30c0 16.6 13.4 30 30 30c16.6 0 30-13.4 30-30C60 13.4 46.6 0 30 0z M39.8 30.4 L25.6 44.6c-0.2 0.2-0.5 0.3-0.7 0.3s-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1 0-1.4l13.5-13.5l-13-13c-0.4-0.4-0.4-1 0-1.4 c0.4-0.4 1-0.4 1.4 0L39.8 29C40.2 29.4 40.2 30.1 39.8 30.4z"
                  fill={ Palette.consentBlue }
                  scale={0.7}
                />
              </Svg>
          </Animated.View>
        </TouchableWithoutFeedback>
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
// onResponderGrant={() => setTimeout(() => this.props.onPress(), 200)} onStartShouldSetResponder={() => true}