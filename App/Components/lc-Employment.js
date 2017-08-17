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
          <View style={styles.listBody}>
            <Text style={styles.listBodyContent}>{company}</Text>
            <Text style={styles.listBodyTitle}>{position}</Text>
            <Text style={styles.listBodySubtitle}>{startDate} - {endDate}</Text>
          </View>
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
    "color": Palette.consentGrayDark,
    "paddingBottom": 5,
    "fontFamily": Design.fonts.robotoLight
  },
  "listBodySubtitle":{
    "fontSize": 12,
    "color": Palette.consentGrayMedium,
    "fontFamily": Design.fonts.robotoLight
  },
  "listBodyContent":{
    "fontSize": 25,
    "color": Palette.consentGray,
    "fontFamily": Design.fonts.robotoLight
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

export default LcEmployment
