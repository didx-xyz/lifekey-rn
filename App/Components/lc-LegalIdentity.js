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

const LcLegalIdentity = React.createClass({
  
  "propTypes" : {
    "expanded": bool,
    "fullName": string,
    "idOrigin": string,
    "idNumber": string
  },
  getInitialState () {
    return {
      "expanded": this.props.expanded
    }
  },
  render () {
    
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

export default LcLegalIdentity
