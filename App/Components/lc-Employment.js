import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text } from 'react-native'

//Internal dependencies 
import Design from "../DesignParameters"
import Palette from "../Palette"
import RcItemDetail from "./ResourceComponents/rc-DetailView"
// import LcSummary from "./LcSummary"


class LcEmployment extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { expanded, company, position, startDate, endDate } = this.props
    
    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <RcItemDetail objKey={"Company"} value={company}></RcItemDetail>
          <RcItemDetail objKey={"Position"} value={position}></RcItemDetail>
          <RcItemDetail objKey={"Start Date"} value={startDate}></RcItemDetail>
          <RcItemDetail objKey={"End Date"} value={endDate}></RcItemDetail>
        </View>
      )
    else
      return (
        <View>
          { /* <LcSummary summary={`${position} at ${company}`}></LcSummary> */ }
          <Text>{position} at {company}</Text>
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

export default LcEmployment
