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
import Countries from "../Countries"
import Languages from "../Languages"
import Design from "../DesignParameters"
import Palette from "../Palette"
import Anonymous from "../Images/anonymous_person"
import RcItemDetail from "./ResourceComponents/rc-DetailView"

class LcPerson extends Component {

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

    const nationalityName = nationality ? Countries.find(c => c["alpha-2"] === nationality).name : "Not yet set"
    const preferredLanguageName = preferredLanguage ? Languages.find(l => l["alpha3-b"] === preferredLanguage).English : "Not yet set"
    const identityPhotographUri = identityPhotograph ? `data:image/jpg;base64,${identityPhotograph}` : Anonymous.uri

    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <RcItemDetail objKey={"Title"} value={title}></RcItemDetail>
          <RcItemDetail objKey={"First Name"} value={firstName}></RcItemDetail>
          <RcItemDetail objKey={"Last Name"} value={lastName}></RcItemDetail>
          <RcItemDetail objKey={"Nationality"} value={nationalityName}></RcItemDetail>
          <RcItemDetail objKey={"Birth Place"} value={birthPlace}></RcItemDetail>
          <RcItemDetail objKey={"Birth Date"} value={birthDate}></RcItemDetail>
          <RcItemDetail objKey={"Avatar"} value={avatar} type={"image"}></RcItemDetail>
          { /* 
            <RcItemDetail objKey={"ID Photo"} value={identityPhotographUri} type={"image"}></RcItemDetail> 
            <RcItemDetail objKey={"Nationality"} value={nationalityName}></RcItemDetail>
            <RcItemDetail objKey={"Preferred Language"} value={preferredLanguageName}></RcItemDetail>
          */}
          <RcItemDetail objKey={"Marital Status"} value={maritalStatus}></RcItemDetail>
          <RcItemDetail objKey={"Marital Contract Type"} value={maritalContractType}></RcItemDetail>
          <RcItemDetail objKey={"Preferred Language"} value={preferredLanguageName}></RcItemDetail>
        </View>
      )
    else
      return (
        <View style={styles.listCard}>
          <View style={styles.listImage}>
            <Image style={styles.image} source={{ uri: identityPhotographUri, scale: 1 }}></Image>
          </View>
          <View style={styles.listBody}>
            <Text style={styles.listBodyContent}>{firstName} {lastName}</Text>
            <Text style={styles.listBodySubtitle}>{nationalityName}</Text>
            <Text style={styles.listBodySubtitle}>{birthDate}, {birthPlace}</Text>
            <Text style={styles.listBodySubtitle}>{preferredLanguageName}</Text>
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

export default LcPerson
