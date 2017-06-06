/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React, { Component } from "react"
import { Text, View } from "react-native"
import PropTypes from "prop-types"

// internal dependencies
import RcItemDetail from "./ResourceComponents/rc-DetailView"
import MobileIcon from "../Components/MobileIcon"
import LandlineIcon from "../Components/LandlineIcon"
import EnvelopeIcon from "../Components/EnvelopeIcon"
import Design from "../DesignParameters"
import Palette from "../Palette"

class LcContactDetail extends Component {
  
  constructor(props) {
    super(props)
  }

  mobileIcon (listCardHeading) {
    switch (listCardHeading) {
      case "Mobile Phone":
        return (<MobileIcon width={22} height={30} stroke="#666" />)
        break;
      case "Landline":
        return (<LandlineIcon width={28} height={18} stroke="#666" />)
        break;
      case "Email":
        return (<EnvelopeIcon width={28} height={18} stroke="#666" />)
        break;
      default:
        return (<EnvelopeIcon width={28} height={18} stroke="#666" />)
    } 
  }

  render () {
  
    const { expanded, listCardHeading, listCardPrimaryDetail, listCardSecondaryDetails } = this.props
    console.log("PROPS: ", listCardHeading)

    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <RcItemDetail objKey={listCardHeading} value={listCardPrimaryDetail}></RcItemDetail>
        </View>
      )
    else
      return (  
        <View style={styles.listCard}>
          <View style={styles.listImageContainer}>
           { this.mobileIcon(listCardHeading) }    
          </View>
          <View style={styles.listBody}>
            <Text style={styles.listBodySubtitle}> {listCardHeading} </Text>
            <Text style={styles.listBodyPrimaryContent}> { listCardPrimaryDetail.length > 18 ? `${listCardPrimaryDetail.substring(0, 17)}...` : listCardPrimaryDetail } </Text>
            <View>
              { this.props.listCardSecondaryDetails.map((sdetail, i) => <Text key={i} style={ styles.listBodySecondaryContent }> {sdetail} </Text> )}
            </View>
          </View>
        </View>
      )
  }
}

LcContactDetail.propTypes = {
  "expanded": PropTypes.bool,
  "listCardHeading": PropTypes.string,
  "listCardPrimaryDetail": PropTypes.string,
  "listCardSecondaryDetails": PropTypes.array,
  "listImageUrl": PropTypes.string
}

const styles = {
  "listCard":{
    "width": "100%",
    "flexDirection": "row"
  },
  "listImageContainer":{
    "flex": 1,
    "marginRight": Design.paddingRight,
    "justifyContent": "flex-start",
    "alignItems": "center"
  },
  "listImage":{
    "width": "100%",
    "justifyContent": "center",
    "alignItems": "center",
    "backgroundColor": Palette.consentGrayMedium
  },
  "listBody":{
    "flex": 18,
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
  "listBodyPrimaryContent":{
    "fontSize": 25,
    "color": Palette.consentGray
  },
  "listBodySecondaryContent":{
    "fontSize": 12,
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

export default LcContactDetail


