/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React, { Component } from 'react'
import { Text, View } from "react-native"
import ActivityIndicator from "ActivityIndicator"
import Palette from "../Palette"

class ProgressIndicator extends Component {

  render () {

    return (
      <View style={styles.progressContainer}>
        <ActivityIndicator color={Palette.consentBlue} style={styles.progressIndicator}/> 
        <Text style={styles.progressText}>{this.props.progressCopy}</Text>
      </View>
    )
  }
}

const styles = {
  "progressContainer": {
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "progressIndicator": {
    "width": 75,
    "height": 75 
  },
  "progressText":{
    "color": Palette.consentGrayDark
  }
}

export default ProgressIndicator
