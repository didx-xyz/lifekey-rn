/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

import React, { Component } from 'react'
import Session from '../../Session'
import Routes from '../../Routes'
import Api from '../../Api'
import Logger from "../../Logger"
import Config from '../../Config'
import Touchable from '../../Components/Touchable'
import ConsentUser from '../../Models/ConsentUser'

import { Text, View, Image } from 'react-native'
import { Container, Content } from 'native-base'

// internal dependencies
import Design from "../../DesignParameters"
import Palette from '../../Palette'
import MvTemplate from "../../Components/mv-Template"
import BackIcon from "../../Components/BackIcon"
import HelpIcon from "../../Components/HelpIcon"
import LifekeyHeader from "../../Components/LifekeyHeader"
import LifekeyCard from "../../Components/LifekeyCard"

class Badges extends Component  {

  render() {
   
    return (
       this.props.badges ?  
         <View style={styles.content}>
            {
              Object.values(this.props.badges).map((b, i) => {
                return (
                    <View key={i} style={styles.badge}>
                      <View style={styles.badgeImage}>
                        <Image style={{"width" : "100%", "height": "100%"}} source={b.image} />
                      </View>
                      <View style={styles.badgeContent}>
                        <View style={styles.badgeName}>
                          
                            <Text style={styles.badgeNameText}>{b.name}</Text>
                          
                        </View>
                        { /* <View style={styles.badgeDescription}>
                          <Text style={styles.badgeDescriptionText}>
                            Complete RICA documentation with verification from Absa Bank.
                          </Text> 
                        </View> */ }
                      </View>
                    </View>
                )
               }) 
            }
            
          </View>
        :
          <Text>NO BADGES YET</Text>
      )
  }
}

const styles = {
  "content": { 
    "height": 650,
    "flex": 1,
    "backgroundColor": Palette.consentGrayLightest,
    "alignItems": "center",
    "justifyContent": "flex-start",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  "badge": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "center",
    "maxHeight": 75,
    "margin": 15,
    "marginBottom": 0,
    "paddingBottom": 15,
    "borderBottomWidth": 2,
    "borderBottomColor": "#ddd"
  },
  "badgeImage": {
    "flex": 1,
    "width": 25,
    "height": 50,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "badgeContent": {
    "flex": 4,
    "flexDirection": "column"
  },
  "badgeName": {
    "flex": 1,
    "paddingLeft": 20
  },
  "badgeNameText": {
    "fontWeight": "bold",
    "color": "#333"
  },
  "badgeDescription": {
    "flex": 1
  },
  "badgeDescriptionText": {
    "color": "#666"
  },
  
}

export default Badges
