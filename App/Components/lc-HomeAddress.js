/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
<<<<<<< HEAD
import React, { Component } from 'react'
import { Text, View, Image } from "react-native"
const { bool, string } = React.PropTypes
=======
import React, { Component } from "react"
import { Text, View } from "react-native"
import PropTypes from "prop-types"
>>>>>>> dev

// internal dependencies
import Design from "../DesignParameters"
import Palette from "../Palette"
import RcItemDetail from "./ResourceComponents/rc-DetailView"

class LcHomeAddress extends Component {
<<<<<<< HEAD
  
  "propTypes" : {
    "expanded": bool,
    "streetAddress": string,
    "suburb": string,
    "province": string,
    "country": string,
    "postOfficeBoxNumber": string,
    "postalCode": string
  } 
=======
>>>>>>> dev

  render () {

    const { expanded, streetAddress, suburb, province, country, postOfficeBoxNumber, postalCode } = this.props

    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
          { /* <Text style={styles.unexpandedListCardCopy}> {streetAddress},{suburb},{province},{country} </Text> */}
          <RcItemDetail objKey={"Street Address"} value={streetAddress}></RcItemDetail>
          <RcItemDetail objKey={"Suburb"} value={suburb}></RcItemDetail>
          <RcItemDetail objKey={"Province"} value={province}></RcItemDetail>
          <RcItemDetail objKey={"Country"} value={country}></RcItemDetail>
          <RcItemDetail objKey={"PO Box"} value={postOfficeBoxNumber}></RcItemDetail>
          <RcItemDetail objKey={"Postal Code"} value={postalCode}></RcItemDetail>
        </View>
      )
    else
      return (
        <View style={styles.container}>
          <View style={styles.addressImageContainer}>
            {/* image here */}
            <Image style={styles.image} source={{uri: "http://www.uwgb.edu/UWGBCMS/media/Maps/images/map-icon.jpg"}}>
              <View style={styles.innerFrame}>
                <Text style={styles.imageText}> {streetAddress},{suburb},{province},{country} </Text>
              </View>
            </Image>
          </View>
        </View>
      )
  }
}

const styles = {
  "container": {
    "width": "100%",
    "flexDirection": "row",
    "height": 150,
    "justifyContent": "center",
    "alignItems": "center",
  },
  "addressImageContainer": {
    "position": "absolute",
    "top": 0,
    "bottom": 0,
    "right": -16,
    "left": -16
  },
  "innerFrame": {
      "flex": 1, 
      "alignItems": "center", 
      "justifyContent": "center",
      "backgroundColor": "rgba(0, 0, 0, .5)", 
  },
  "image":{
    "height": "100%",
    "width": "100%" 
  },
  "imageText": {
    "color": "white"
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
