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
import RcItemDetail from "./ResourceComponents/rc-DetailView"

class LcPerson extends Component {
  
  constructor(props) {
    super(props)
  }

  render () {

    const { 
      expanded, 
      title, 
      firstName, 
      lastName, 
      nationality, 
      birthPlace, 
      birthDate, 
      alias, 
      avatar, 
      identityPhotograph, 
      maritalStatus, 
      maritalContractType, 
      preferredLanguage  
    } = this.props

    const identityPhotographUri = `data:image/jpg;base64,${identityPhotograph}`

    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <RcItemDetail objKey={"Title"} value={title}></RcItemDetail>
          <RcItemDetail objKey={"First Name"} value={firstName}></RcItemDetail>
          <RcItemDetail objKey={"Last Name"} value={lastName}></RcItemDetail>
          <RcItemDetail objKey={"Nationality"} value={nationality}></RcItemDetail>
          <RcItemDetail objKey={"Birth Place"} value={birthPlace}></RcItemDetail>
          <RcItemDetail objKey={"Birth Date"} value={birthDate}></RcItemDetail>
          <RcItemDetail objKey={"Avatar"} value={avatar} type={"image"}></RcItemDetail>
          <RcItemDetail objKey={"ID Photo"} value={identityPhotographUri} type={"image"}></RcItemDetail>
          <RcItemDetail objKey={"Marital Status"} value={maritalStatus}></RcItemDetail>
          <RcItemDetail objKey={"Marital Contract Type"} value={maritalContractType}></RcItemDetail>
          <RcItemDetail objKey={"Preferred Language"} value={preferredLanguage}></RcItemDetail>
        </View>
      )
    else
      return (
        <View style={styles.listCard}>
          <View style={styles.listImage}>
            <Image style={styles.image} source={{ uri: identityPhotographUri, scale: 1 }}></Image>
          </View>
          <View style={styles.listBody}>
            <Text style={styles.listBodyTitle}> {title} {firstName} {lastName} </Text>
            <Text style={styles.listBodySubtitle}> {nationality} </Text>
            <Text style={styles.listBodyContent}> {preferredLanguage} </Text>
          </View>
        </View>
      )
  }
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
  "image":{
    "height": 50,
    "width": 50,
    "resizeMode": "contain",
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

export default LcPerson
