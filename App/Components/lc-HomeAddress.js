/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React from "react"
import { Text, View } from "react-native"
const { bool, string } = React.PropTypes

// internal dependencies
import Design from "../DesignParameters"
import Palette from "../Palette"

const LcHomeAddress = React.createClass({
  
  "propTypes" : {
    "expanded": bool,
    "address": string
  },
  render () {
    
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

export default LcHomeAddress
