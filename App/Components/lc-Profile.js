/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React, { Component } from 'react'
import { Text, View, Image } from "react-native"
import PropTypes from "prop-types"

// internal dependencies
import Design from "../DesignParameters"
import Palette from "../Palette"
import Anonymous from "../Images/anonymous_person"
import RcItemDetail from "./ResourceComponents/rc-DetailView"
import CircularImage from "./CircularImage"
import LcContactDetail from "./lc-ContactDetail"

class LcProfile extends Component {

  render () {

    const { 
      expanded,  
      display_name, 
      image_uri, 
      tel, 
      address, 
      email
    } = this.props

    const identityPhotographUri = image_uri || Anonymous.uri

    return (
        <View style={styles.cardContainer}>
    	  <Text style={Object.assign({}, styles.listBodySubtitle, {"zIndex": 1})}>This information is publicly available.</Text>
          <View style={styles.listCard}>
            <CircularImage uri={identityPhotographUri} radius={30} borderColor={Palette.consentOffWhite} />
            <Text style={styles.listBodyContent}>{display_name}</Text>
          </View>
          <LcContactDetail listCardType="Email" listCardHeading="Email" listCardPrimaryDetail="" listCardSecondaryDetail={ email } /> 
          <LcContactDetail listCardType="Mobile Phone" listCardHeading="Mobile Phone" listCardPrimaryDetail="" listCardSecondaryDetail={ tel } />
          <LcContactDetail listCardType="Address" listCardHeading="Address" listCardPrimaryDetail="" listCardTertiaryDetail={ address } />
        </View>
      )
      
  }
}

const styles = {
  "cardContainer":{
    "width": "100%"
  },
  "listCard":{
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "center"
  },
  "listImage":{
    "flex": 1,
    "marginRight": Design.paddingRight,
    "justifyContent": "space-around",
    "alignItems": "center"
  },
  "image":{
    "height": "100%",
    "width": "100%",
    "minHeight": 90,
    "resizeMode": "contain",
  },
  "listBody":{
    "flex": 4,
    "justifyContent": "space-around",  
    "paddingTop": 5,
    "paddingBottom": 5, 
  },
  "listBodyTitle":{
    "fontSize": 18,
    "color": Palette.consentGrayDark
  },
  "listBodySubtitle":{
    "fontSize": 12,
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

export default LcProfile
