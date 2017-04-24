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
import Routes from '../Routes'
import Api from '../Api'
import Logger from "../Logger"
import Config from '../Config'
import Touchable from '../Components/Touchable'
import ConsentUser from '../Models/ConsentUser'

import { Text, View, Image } from 'react-native'
import { Container, Content } from 'native-base'

// internal dependencies
import Design from "../DesignParameters"
import Palette from '../Palette'
import MvTemplate from "../Components/mv-Template"
import BackIcon from "../Components/BackIcon"
import HelpIcon from "../Components/HelpIcon"
import LifekeyHeader from "../Components/LifekeyHeader"
import LifekeyCard from "../Components/LifekeyCard"

var person = {
  mycode: '+',
  facematch: '-',
}

export default class MeConnect extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      "tabName":  "Connect",
      "informationSource": "MY CODE"
    }

    this.onBoundPressMyCode= this.onPressMyCode.bind(this)
    this.onBoundPressFaceMatch = this.onPressFaceMatch.bind(this)
  }

  _hardwareBack() {
    this.navigator.pop()
    return true
  }

  onPressMyCode() {
    this.setState({ informationSource: "MY CODE" })
  }
  onPressFaceMatch() {
    this.setState({ informationSource: "FACE MATCH" })   
  }

  currentInformationState(){
    if(this.state.informationSource === "MY CODE")
      return (
        <View>
          <View style={styles.qrCodeContainer}>
            <Text>{person.mycode}</Text>
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
      )
    else
      return (
        <View>
          <View style={styles.qrCodeContainer}>
            <Image style={styles.qrImage} source={{ uri: `http://staging.api.lifekey.cnsnt.io/facial-verification?user_did=${ConsentUser.getDidSync()}` }} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Get someone else to scan this QR Code to verify your facial match</Text>
          </View>
          <View style={styles.footer}>
            <Touchable onPress={this.onBoundPressHelp}>
              <HelpIcon width={32} height={32} stroke="#666" />
            </Touchable>
          </View>
        </View>
      )    
  }

  render() {
    return (
      
      <MvTemplate
        tabName={this.state.tabName}
        header={
          () => <LifekeyHeader
            icons={[
              {
                icon: <BackIcon {...Design.backIcon}/>,
                onPress: () => this.navigator.pop()
              },
              {
                icon: <Text>:)</Text>,
                onPress: () => alert("test")
              },
              {
                icon: <Text>+</Text>,
                onPress: () => alert("test")
              }
            ]}
            tabs={[
              {
                text: "Connect",
                onPress: () => this.setTab(0),
                active: this.state.activeTab === 0
              },
              {
                text: "My Data",
                onPress: () => this.setTab(1),
                active: this.state.activeTab === 1
              },
              {
                text: "Badges",
                onPress: () => this.setTab(2),
                active: this.state.activeTab === 2
              }
            ]}
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.switchButtonContainer}>
            <View style={Object.assign({}, styles.switchButton, styles.switchButtonLeft, 
              {"backgroundColor": this.state.informationSource === "MY CODE" ? Palette.consentBlue : Palette.consentGrayLightest})}>
              <Touchable onPress={this.onBoundPressMyCode}>
                <Text style={Object.assign({}, styles.switchButtonText, {"color": this.state.informationSource === "MY CODE" ? "white" : Palette.consentBlue})}>MY CODE</Text>
              </Touchable>
            </View>
            <View style={Object.assign({}, styles.switchButton, styles.switchButtonRight, {"backgroundColor": this.state.informationSource === "FACE MATCH" ? Palette.consentBlue : Palette.consentGrayLightest})}>
              <Touchable onPress={this.onBoundPressFaceMatch}>
                <Text style={Object.assign({}, styles.switchButtonText, {"color": this.state.informationSource === "FACE MATCH" ? "white" : Palette.consentBlue})}>FACE MATCH</Text>
              </Touchable>
            </View>
          </View>
          <View style={styles.informationContainer}>
            { this.currentInformationState() }
          </View>
          
        </View>
      </MvTemplate> 
    )
  }
}

const styles = {
  "content": { 
    "height": `${100 - Design.navigationContainerHeight}%`,
    "backgroundColor": Palette.consentGrayLightest,
    "alignItems": "center",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  "switchButtonContainer":{
    "flex": 2,
    "flexDirection": "row",
    "width": "75%",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "switchButton":{
    "height": 30,
    "width": "40%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "borderColor": Palette.consentBlue,
    "borderWidth": 1,
    "paddingLeft": 15,
    "paddingRight": 15,
  },
  "switchButtonLeft":{
    "borderTopLeftRadius": 20,
    "borderBottomLeftRadius": 20
  },
  "switchButtonRight":{
    "borderTopRightRadius": 20,
    "borderBottomRightRadius": 20
  },
  "switchButtonText":{
    "fontSize": 10
  },
  "informationContainer":{
    "flex": 6,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "qrCodeContainer": {
    "flex": 4,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "qrImage": {
    "width": "70%",
    "height": "100%"
  },
  "textContainer": {
    "flex": 2,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "text":{
    "color": Palette.consentGrayDark,
    "textAlign": "center",
  },
  "footer": {
    "flex": 1,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "space-between"
  },
  "footerText": {
    "fontSize": 16,
    "color": Palette.consentGrayDark,
  }
  
}
