import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text } from 'react-native'

//Internal dependencies 
import Design from "../DesignParameters"
import Palette from "../Palette"
import Countries from "../Countries"
import RcItemDetail from "./ResourceComponents/rc-DetailView"
// import LcSummary from "./LcSummary"


class LcIdentity extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { expanded, identificationType, identificationNumber, issuingCountry, dateIssued, expiryDate, categoryType, endorsements } = this.props
    const nationalityName = issuingCountry ? Countries.find(c => c["alpha-2"] === issuingCountry).name : "Not yet set"

    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <RcItemDetail objKey={"Identification Type"} value={identificationType}></RcItemDetail>
          <RcItemDetail objKey={"Identification Number"} value={identificationNumber}></RcItemDetail>
          <RcItemDetail objKey={"Issuing Country"} value={issuingCountry}></RcItemDetail>
          <RcItemDetail objKey={"Date Issued"} value={dateIssued}></RcItemDetail>
          <RcItemDetail objKey={"Expiry Date"} value={expiryDate}></RcItemDetail>
          <RcItemDetail objKey={"Category Type"} value={categoryType}></RcItemDetail>
          <RcItemDetail objKey={"Endorsements"} value={endorsements}></RcItemDetail>
        </View>
      )
    else
      return (
        <View style={styles.listBody}>
          <Text style={styles.listBodyTitle}>{nationalityName} - {identificationType}</Text>
          <Text style={styles.listBodyContent}>{identificationNumber}</Text>
          <Text style={styles.listBodySubtitle}>Issued: {dateIssued}    Expires: {expiryDate}</Text>
        </View>
      )
  }
}

const styles = {
  "listBody":{
    "flex": 1,
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

export default LcIdentity
