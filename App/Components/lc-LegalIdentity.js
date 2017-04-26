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

class LcLegalIdentity extends Component {
  constructor(...params) {
    super(...params)

    this.state = {
      "expanded": this.props.expanded
    }
  }

  render () {

    const { expanded, fullName, idOrigin, idNumber } = this.props

    if(!expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <Text style={styles.unexpandedListCardCopy}> {fullName}, {idNumber} </Text>
          <Text style={styles.unexpandedListCardCopy}> Copy of ID attached </Text>
        </View>
      )
    else
      return (
        <View style={styles.listCard}>
          <View style={styles.listImage}>
            {/* image here */}
            <Text> + </Text>
          </View>
          <View style={styles.listBody}>
            <Text style={styles.listBodyTitle}> {fullName} </Text>
            <Text style={styles.listBodySubtitle}> {idOrigin} </Text>
            <Text style={styles.listBodyContent}> {idNumber} </Text>
          </View>
        </View>
      )
  }
})

LcLegalIdentity.propTypes = {
  "expanded": PropTypes.bool,
  "fullName": PropTypes.string,
  "idOrigin": PropTypes.string,
  "idNumber": PropTypes.string
}

const styles = {
  "listCard":{
    "width": "100%",
    "flexDirection": "row"
  },
  "listImage":{
    "flex": 1,
    "marginRight": Design.paddingRight,
    "justifyContent": "space-around",
    "alignItems": "center",
    "backgroundColor": Palette.consentGrayMedium
  },
  "listBody":{
    "flex": 4,
    "justifyContent": "space-around",
    "paddingTop": 5,
    "paddingBottom": 5,
  },
  "listBodyTitle":{
    "fontSize": 16,
    "color": Palette.consentGrayDark
  },
  "listBodySubtitle":{
    "fontSize": 10,
    "color": Palette.consentGrayMedium
  },
  "listBodyContent":{
    "fontSize": 25,
    "color": Palette.consentGray
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

export default LcLegalIdentity
