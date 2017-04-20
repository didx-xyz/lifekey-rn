/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React, { Component } from "react"
import { Text, View } from "react-native"
const { bool, string, func } = React.PropTypes

// internal dependencies
import Touchable from "./Touchable"
import Design from "../DesignParameters"
import Palette from "../Palette"
import PropTypes from 'prop-types'

class Button extends Component {
  render() {

    const styles = {
      button: {
        paddingTop: Design.paddingTop,
        paddingBottom: Design.paddingBottom,
        paddingLeft: Design.paddingLeft * 2,
        paddingRight: Design.paddingRight * 2,
        borderRadius: 5,
        marginLeft: Design.paddingTop / 2,
        marginRight: Design.paddingTop / 2,
      },
      buttonRed: {
        backgroundColor: "red"
      },
      buttonText: {
        fontSize: 18,
        color: "white",
        fontWeight: "300"
      },
    }

    const { buttonText, affirmative, onClick } = this.props
    const backgroundColor = affirmative ? Palette.consentBlue : Palette.consentRed

    return (
      <View style={Object.assign({}, styles.button, { backgroundColor: backgroundColor })}>
        <Touchable onPress={onClick}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Touchable>
      </View>
    )
  }
}

Button.propTypes = {
  buttonText: PropTypes.string,
  affirmative: PropTypes.bool,
  onClick: PropTypes.func
}

export default Button
