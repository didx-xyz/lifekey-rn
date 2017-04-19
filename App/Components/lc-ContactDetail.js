/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React from "react"
import { Text, View } from "react-native"
const { bool, array, string } = React.PropTypes

// internal dependencies
import MobileIcon from "../Components/MobileIcon"
import LandlineIcon from "../Components/LandlineIcon"
import EnvelopeIcon from "../Components/EnvelopeIcon"
import Design from "../DesignParameters"
import Palette from "../Palette"

const LcContactDetail = React.createClass({
  
  "propTypes" : {
    "expanded": bool,
    "listCardHeading": string,
    "listCardPrimaryDetail": string,
    "listCardSecondaryDetails": array,
    "listImageUrl": string
  },
  mobileIcon (listCardHeading) {
    switch (listCardHeading) {
      case "Mobile":
        return (<MobileIcon width={22} height={30} stroke="#666" />)
        break;
      case "Home":
        return (<LandlineIcon width={28} height={18} stroke="#666" />)
        break;
      case "Email":
        return (<EnvelopeIcon width={28} height={18} stroke="#666" />)
        break;
      default:
        return (<EnvelopeIcon width={28} height={18} stroke="#666" />)
    } 
  },
  render () {
    
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

    const { expanded, listCardHeading, listCardPrimaryDetail, listCardSecondaryDetails } = this.props

    if(!expanded)
      return (
        <View style={styles.unexpandedListCard}>
          <Text style={styles.unexpandedListCardCopy}> {listCardPrimaryDetail} and {listCardSecondaryDetails.length} more </Text>
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
            <Text style={styles.listBodyPrimaryContent}> {listCardPrimaryDetail} </Text>
            <View>
              { this.props.listCardSecondaryDetails.map((sdetail, i) => <Text key={i} style={ styles.listBodySecondaryContent }> {sdetail} </Text> )}
            </View>
          </View>
        </View>

      )
  }
})

export default LcContactDetail
