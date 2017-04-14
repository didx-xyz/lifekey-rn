// ME TEMPLATE - HEIN

/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Palette from '../Palette'
import Routes from '../Routes'
import Config from '../Config'
import MvTemplate from '../Components/mv-Template'
import Touchable from '../Components/Touchable'

import { Text, View } from 'react-native'
import { Container, Content } from 'native-base'

import HelpIcon from "../Components/HelpIcon"

// internal dependencies
import Design from "../DesignParameters"

var person = {
  qrCode: '+'
}

export default class MeConnect extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      activeTab: 0 // Connect
    }

    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressShare = this.onPressShare.bind(this)
  }

  _hardwareBack() {
    this.navigator.pop()
    return true
  }

  onPressHelp() {
    alert("help")
  }
  onPressShare() {
    alert("share")
  }

  render() {
    return (
      
      <MvTemplate activeTab={this.state.activeTab}>
        <View style={styles.content}>
          <View style={styles.qrCodeContainer}>
            {/* Image goes here */}
            <Text>{person.qrCode}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Invite other people to connect with you by sharing your unique ID code</Text>
          </View>
          <View style={styles.footer}>
            <Touchable onPress={this.onBoundPressHelp}>
              <HelpIcon width={32} height={32} stroke="#666" />
            </Touchable>
            <Touchable onPress={this.onBoundPressShare}>
              <Text style={styles.footerText}>Share</Text>
            </Touchable>
          </View>
        </View>
      </MvTemplate> 
    )
  }
}

const styles = {
  "content": { 
    "height": `${100 - Design.navigationContainerHeight}%`,
    backgroundColor: Palette.consentGrayLightest,
    alignItems: "center",
    justifyContent: "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  "headerContainer": {
    height: `${Design.navigationContainerHeight}%`,
    borderColor: Palette.consentGrayLightest, 
    borderBottomWidth: 1
  },
  "qrCodeContainer": {
    flex: 4,
    "height": `${100 - Design.navigationContainerHeight}%`,
    alignItems: "center",
    justifyContent: "center"
  },
  "textContainer": {
    flex: 2,
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  "text":{
    "color": Palette.consentGrayDark,
    "textAlign": "center",
  },
  "footer": {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  "footerText": {
    "fontSize": 16,
    "color": Palette.consentGrayDark,
  }
  
}
