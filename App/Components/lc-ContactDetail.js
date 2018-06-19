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
import LocationTagIcon from "../Components/LocationTagIcon"
import Design from "../DesignParameters"
import Palette from "../Palette"

class LcContactDetail extends Component {

  mobileIcon (listCardType) {
    
    const height = 22
    const width = 32
    const colour = Design.generalIconColour

    let icon
    
    switch (listCardType) {
      case "Mobile Phone":
        icon = <MobileIcon width={width} height={width} stroke={colour} />
        break
      case "Landline":
        icon = <LandlineIcon width={width} height={height} stroke={colour} />
        break
      case "Email":
        icon = <EnvelopeIcon width={width} height={height} stroke={colour} />
        break
      case "Address":
        icon = <LocationTagIcon width={width} height={height} stroke={colour} />
        break
      default:
        icon = <EnvelopeIcon width={width} height={height} stroke={colour} />
    } 

    return icon
  }

  render () {
  
    const { expanded, listCardType, listCardHeading, listCardPrimaryDetail, listCardSecondaryDetail, listCardTertiaryDetail } = this.props
    console.log("PROPS: ", listCardHeading)

    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <RcItemDetail objKey={listCardHeading} value={listCardPrimaryDetail}></RcItemDetail>
        </View>
      )
    else if(listCardPrimaryDetail || listCardSecondaryDetail || listCardTertiaryDetail){
      return (  
        <View style={styles.listCard}>
          <View style={styles.listImageContainer}>
           { this.mobileIcon(listCardType) }    
          </View>
          <View style={styles.listBody}>
            { !!listCardPrimaryDetail &&  <Text style={styles.listBodyPrimaryContent}> { listCardPrimaryDetail.length > 18 ? `${listCardPrimaryDetail.substring(0, 17)}...` : listCardPrimaryDetail } </Text> }
            { !!listCardSecondaryDetail && <Text style={styles.listBodySecondaryContent}>{ listCardSecondaryDetail }</Text> }
            { !!listCardTertiaryDetail && <Text style={styles.listBodyTertiaryContent}>{ listCardTertiaryDetail }</Text> }
          </View>
        </View>
      )
    }
    else
      return null
  }
}

LcContactDetail.propTypes = {
  "expanded": PropTypes.bool,
  "listCardHeading": PropTypes.string,
  "listCardPrimaryDetail": PropTypes.string,
  "listCardSecondaryDetail": PropTypes.string,
  "listCardTertiaryDetail": PropTypes.string,
  "listImageUrl": PropTypes.string
}

const styles = {
  "listCard":{
    "width": "100%",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center",
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
    "fontSize": 18,
    "color": Palette.consentGrayDark
  },
  "listBodySubtitle":{
    "fontSize": 10,
    "color": Palette.consentGrayMedium
  },
  "listBodyPrimaryContent":{
    "fontSize": 25,
    "fontFamily": Design.fonts.robotoLight,
    "color": Palette.consentGray
  },
  "listBodySecondaryContent":{
    "fontSize": 18,
    "color": Palette.consentGray
  },
  "listBodyTertiaryContent":{
    "fontSize": 14,
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


