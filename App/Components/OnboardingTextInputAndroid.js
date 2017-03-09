import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import Palette from '../Palette'
import Svg, {
    Path
} from 'react-native-svg'
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

  _changeUnderlineColor(e, color) {
    this.setState({ underlineColor: color })
  }

  _toggleState(color, buttonVisible) {
    this.setState({ underlineColor: color })

  }

  render() {
    const platformInputStyle = Platform.OS === 'android'
                             ? {} // android
                             : { borderBottomWidth: 1, borderColor: this.state.underlineColor } // ios
    return (
      <View
        onStartShouldSetResponder={() => this._startShouldSetResponder('OnboardingTextInput')}
        style={[style.wrappingView, platformInputStyle, {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
      }]}>
        <TextInput
          ref={input => {this._input = input }}
          onFocus={() => this._focus()}
          onBlur={() => this._blur()}
          onChangeText={text => this.props.onChangeText(text)}
          value={this.props.value}
          style={[{ flex: 1, fontSize: 30 }]}
          underlineColorAndroid={ this.state.underlineColor }
          scrollEnabled={false}
          onSubmitEditing={() => { alert('done editing') }}
          returnKeyValue="done"
        />
        <TouchableWithoutFeedback style={{ flex: 1, width: 50, height: 50, backgroundColor: 'green' }} onPress={() => alert('touchable works')}>
          <Animated.View style={{ alignItems: 'center', justifyContent: 'center', opacity: this.state.fadeAnim }} >
            <View onStartShouldSetResponder={() => true} style={{ width: 50, height: 50 }}>
              <Svg  height="100" width="100">
                <Path
                  d="M30,0C13.4 0 0 13.4 0 30c0 16.6 13.4 30 30 30c16.6 0 30-13.4 30-30C60 13.4 46.6 0 30 0z M39.8 30.4 L25.6 44.6c-0.2 0.2-0.5 0.3-0.7 0.3s-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1 0-1.4l13.5-13.5l-13-13c-0.4-0.4-0.4-1 0-1.4 c0.4-0.4 1-0.4 1.4 0L39.8 29C40.2 29.4 40.2 30.1 39.8 30.4z"
                  fill={ Palette.consentBlue }
                  scale={0.7}
                  onPress={this.props.onPress}
                />
              </Svg>
            </View>
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