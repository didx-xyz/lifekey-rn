
/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

import React, { Component } from 'react'
import PropTypes from "prop-types"
import Touchable from '../../Components/Touchable'

import { Text, TextInput, View, Platform } from 'react-native'

// internal dependencies
import Palette from '../../Palette'
import HexagonDots from '../../Components/HexagonDots'
import Dots from '../../Components/Dots'

class AuthScreen extends Component {
  state = {
    openKeyBoard: false
  }

  render() {
    return (
      <Touchable onPress={() => {
        if (Platform.OS === "ios") {
          this.pinInput.focus();
        } else {
          this.pinInput.blur();
        }
      }}>
        <View style={style.pinContainer}>
          <View style={Object.assign({}, style.pinElement, { "paddingTop": this.props.paddingTop, "paddingBottom": this.props.paddingBottom })}>
            <HexagonDots height={90}
                         width={80}
                         current={this.props.pin.length < 5 ? this.props.pin.length : 4} />
          </View>
          <View style={style.pinElement}>
            {this.props.loading_indicator && (<Text style={style.please_wait}>Please wait...</Text>)}
            <Dots current={this.props.pin.length}
                  fullFill={Palette.consentOffWhite}
                  emptyFill={Palette.consentGrayDarkest}
                  strokeColor="transparent" />
          </View>
          <TextInput ref={(_ref) => this.pinInput = _ref}
                     autoFocus={true}
                     returnKeyType="done"
                     keyboardType="phone-pad"
                     onBlur={() => {
                       if (Platform.OS === "android") {
                         this.pinInput.focus();
                       }
                     }}
                     underlineColorAndroid="transparent"
                     onChangeText={(text) => this.props.onValueChanged(text)}
                     style={[style.pinInput]} />
        </View>
      </Touchable>
    )
  }
}

const style = {
  please_wait: {
    textAlign: 'center',
    color: 'white'
  },
  "pinInput": {
    height: 0,
    marginLeft: -1000
  },
  "pinContainer": {
    "width": "100%",
    "minHeight": 200
  },
  "pinElement": {
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center"
  }
}

AuthScreen.defaultProps = {
  loading_indicator: false,
  "pin": "",
  "paddingTop": 48,
  "paddingBottom": 24
}

AuthScreen.propTypes = {
  loading_indicator: PropTypes.bool,
  "pin": PropTypes.string.isRequired,
  "paddingTop": PropTypes.number,
  "paddingBottom": PropTypes.number
}

export default AuthScreen
