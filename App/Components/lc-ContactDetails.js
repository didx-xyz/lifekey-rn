/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React from "react"
import { Text, View } from "react-native"
const { bool, array, string } = React.PropTypes

// internal dependencies
import Design from "../DesignParameters"
import Palette from "../Palette"
import LcContactDetail from '../Components/lc-ContactDetail'

const LcContactDetails = React.createClass({
  
  "propTypes" : {
    "expanded": bool,
    "contactDetails": array
  },
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

export default LcContactDetails
