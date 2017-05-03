import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text } from 'react-native'

//Internal dependencies 
import Design from "../DesignParameters"
import Palette from "../Palette"

class LcSummary extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { summary } = this.props
    
    return (
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          {/* Image goes here */}
          <Text>+</Text>
        </View>
        <Text style={styles.summaryContainer}>{summary}</Text>
      </View>
    )
  }
}

const styles = {
  "wrapper": {
    "backgroundColor": Palette.consentGrayLight
  },
  "imageContainer": {
    "width": "100%",
    "flexDirection": "column",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "summaryContainer":{
    "fontSize": 12,
    "color": Palette.consentGrayDark,
    "justifyContent": "center",
    "alignItems": "center"
  }
}

export default LcSummary
