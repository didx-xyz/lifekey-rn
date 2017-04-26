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
import LcContactDetail from '../Components/lc-ContactDetail'

class LcContactDetails extends Component {
  render () {

    const { expanded, contactDetails } = this.props
    return (

      <View style={{"flex": 1}}>
  			{ /* The key for this map is the index. Which is a bad idea. */ }
  			{ contactDetails.map((detail, i) => <LcContactDetail key={i} {...detail } expanded={expanded} /> )}
  		</View>
    )
  }
})

LcContactDetails.propTypes = {
  "expanded": PropTypes.bool,
  "contactDetails": PropTypes.array
}

export default LcContactDetails
