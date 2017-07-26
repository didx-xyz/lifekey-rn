
import React, { Component } from 'react'
import { Text, View, Image, Dimensions, StatusBar } from 'react-native'
import { Container, Content } from 'native-base'
import ActivityIndicator from "ActivityIndicator"
import Session from '../../Session'
import Routes from '../../Routes'
import Logger from "../../Logger"
import Config from '../../Config'
import Touchable from '../../Components/Touchable'
import ConsentUser from '../../Models/ConsentUser'

// internal dependencies
import Design from "../../DesignParameters"
import Palette from '../../Palette'
import MvTemplate from "../../Components/mv-Template"
import BackIcon from "../../Components/BackIcon"
import HelpIcon from "../../Components/HelpIcon"
import LifekeyHeader from "../../Components/LifekeyHeader"
import LifekeyCard from "../../Components/LifekeyCard"

const helpScreens = [ 
  { "image": require("../../Images/qr.png"), "heading": "Connect", "copy": "Qi Code connects me in a snap & replaces paperwork" }
]

class Connect extends Component  {

  constructor(...params) {
    super(...params)

    this.state = {
      "informationSource": "MY CODE"
    }

    this.onBoundPressMyCode= this.onPressMyCode.bind(this)
    this.onBoundPressFaceMatch = this.onPressFaceMatch.bind(this)
    this.onBoundPressProfile = this.props.onPressProfile.bind(this)
    this.onBoundPressShare = this.onPressShare.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)

    console.log("USER QR: ", `http://staging.api.lifekey.cnsnt.io/qr-2/${ConsentUser.getDidSync()}?cache=${new Date().getTime()}`)
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
  
  onPressShare() {
    alert("SHARE")
  }
  onPressHelp() {
    this.props.onPressHelp("me", helpScreens, "pop")
  }

  onImageError(e){
    console.log(e)
  }

  renderMyCode() {
    return(  
      <View>
        <View style={styles.qrCodeContainer}>
          <Image style={styles.qrImage} source={{ uri: `http://staging.api.lifekey.cnsnt.io/qr-2/${ConsentUser.getDidSync()}?cache=${new Date().getTime()}` }} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Invite other people to connect with you by sharing your unique ID code</Text>
        </View>
      </View>
    )
  }

  currentInformationState(){
    if(this.state.informationSource === "MY CODE"){
      return this.renderMyCode()
    }
    else
      return (
        <View>
          <View style={styles.qrCodeContainer}>
            <Image style={styles.qrImage} onError={this.onImageError.bind(this)} source={{ uri: `http://staging.api.lifekey.cnsnt.io/facial-verification?user_did=${ConsentUser.getDidSync()}&cachebust=${Date.now()}` }} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Get someone else to scan this QR Code to verify your facial match</Text>
          </View>
        </View>
      )    
  }

  render() {

    return (    
      <View style={styles.content}>
        { !!this.props.profile.display_name ?
          <View style={ {"flex": 1} }>
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
        :
          <Text style={ {"paddingTop": Design.paddingTop} }>
            <Text style={ styles.defaultFont }>
              Hi there, 
              {"\n\n"}
              In order to connect with others, you need a profile.
              {"\n\n"}
              Quickly set it up
            </Text>
            <Text onPress={this.onBoundPressProfile} style={ Object.assign({}, styles.defaultFont, { "color": Palette.consentBlue }) }> here.</Text>
          </Text>
        } 
      </View>
    )
  }
}

const styles = {
  "content": { 
    "height": Dimensions.get('window').height - Design.lifekeyHeaderHeight - StatusBar.currentHeight,
    "backgroundColor": Palette.consentGrayLightest,
    "alignItems": "center",
    "justifyContent": "flex-start",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  "switchButtonContainer":{
    "flex": 1,
    "flexDirection": "row",
    "width": "100%",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "switchButton":{
    "height": 30,
    "width": "30%",
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
    "borderBottomLeftRadius": 20,
    "marginRight": -1 // To mitigate strange anti-aliasing line that appears between buttons
  },
  "switchButtonRight":{
    "borderTopRightRadius": 20,
    "borderBottomRightRadius": 20
  },
  "switchButtonText":{
    "fontSize": 10
  },
  "informationContainer":{
    "flex": 3,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "qrCodeContainer": {
    "flex": 2,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "qrImage": {
    "width": 220,
    "height": 220
  },
  "textContainer": {
    "flex": 2,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "flex-start",
    "justifyContent": "center",
    "paddingTop": 50
  },
  "text":{
    "color": Palette.consentGrayDark,
    "textAlign": "center",
  },
  "defaultFont":{
    fontFamily: Design.fonts.registration,
    fontWeight: Design.fontWeights.light,
    fontSize: 38,
    lineHeight: 48
  } 
}

export default Connect
