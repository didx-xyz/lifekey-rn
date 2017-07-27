// external dependencies
import React, { Component } from "react"
import { Text, View } from "react-native"

// internal dependencies
import Touchable from "./Touchable"
import Design from "../DesignParameters"
import Palette from "../Palette"
import PropTypes from "prop-types"

class Button extends Component {
  render() {
    const { buttonText, affirmative, onClick } = this.props
    const backgroundColor = affirmative ? Palette.consentBlue : Palette.consentRed

    return (
      <Touchable onPress={onClick}>
        <View style={Object.assign({}, styles.button, { backgroundColor })}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </Touchable>
    )
  }
}

Button.propTypes = {
  "buttonText": PropTypes.string,
  "affirmative": PropTypes.bool,
  "onClick": PropTypes.func
}

const styles = {
  "button": {
    "paddingTop": Design.paddingTop,
    "paddingBottom": Design.paddingBottom,
    "paddingLeft": Design.paddingLeft * 2,
    "paddingRight": Design.paddingRight * 2,
    "borderRadius": 5,
    "marginLeft": Design.paddingTop / 2,
    "marginRight": Design.paddingTop / 2
  },
  "buttonRed": {
    "backgroundColor": "red"
  },
  "buttonText": {
    "fontSize": 18,
    "color": "white",
    "fontWeight": "300"
  }
}

export default Button
