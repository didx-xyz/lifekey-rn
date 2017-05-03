import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text } from 'react-native'

//Internal dependencies 
import Design from "../DesignParameters"
import Palette from "../Palette"
import RcItemDetail from "./ResourceComponents/rc-DetailView"
// import LcSummary from "./LcSummary"


class LcIdentity extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { expanded, identificationType, identificationNumber, issuingCountry, dateIssued, expiryDate, categoryType, endorsements } = this.props

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
        <View>
          <Text>{issuingCountry} - {identificationType} : {identificationNumber} </Text>
        </View>
      )
  }
}

const styles = {
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
