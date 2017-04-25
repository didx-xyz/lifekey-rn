/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React, { Component } from "react"
import { Text, View } from "react-native"
import PropTypes from "prop-types"

// internal dependencies
import Design from "../DesignParameters"
import Palette from "../Palette"

class LcHomeAddress extends Component {

  render () {

    const { expanded, address } = this.props

    if(!expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <Text style={styles.unexpandedListCardCopy}> {address} </Text>
        </View>
      )
    else
      return (
        <View style={styles.addressImage}>
          {/* image here */}
          <Text>+</Text>
          <Text> {address} </Text>
        </View>
      )
  }
})

LcHomeAddress.propTypes = {
  "expanded": PropTypes.bool,
  "address": PropTypes.string
}

const styles = {
  "addressImage": {
    "flex": 1,
    "width": "100%",
    "flexDirection": "row",
    "height": 150,
    "justifyContent": "center",
    "alignItems": "center",
    "marginRight": -15,
    "marginLeft": -15,
    "backgroundColor": Palette.consentGrayLight
  },
  "unexpandedListCard": {
    "width": "100%",
    "flexDirection": "column"
  },
  "unexpandedListCardCopy":{
    "fontSize": 12,
    "color": Palette.consentGrayDark
  }
}

export default LcHomeAddress
