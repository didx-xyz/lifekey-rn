
import React, { Component } from 'react'
import { Text, View, Image, Dimensions, StatusBar, ImageBackground } from 'react-native'
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
    this.onBoundPressProfile = this.props.connectWithMe && this.props.onPressProfile.bind(this)
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
          <ImageBackground style={styles.qrContainerImage} source={require('../../Images/QRFrame3.png')}> 
            <Image style={styles.qrImage} source={{ uri: `http://staging.api.lifekey.cnsnt.io/qr-2/${this.props.profile.did}?cache=${new Date().getTime()}` }} /> 
            {/*<Image style={styles.qrImage} source={{ uri: `http://staging.api.lifekey.cnsnt.io/qr-scale3/${this.props.profile.did}?cache=${new Date().getTime()}` }} /> */}
          </ImageBackground> 
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Invite other people to connect with { this.props.connectWithMe ? <Text>you</Text> : <Text>{this.props.profile.display_name}</Text> } by sharing { this.props.connectWithMe ? <Text>your</Text> : <Text>their</Text> } unique { this.props.connectWithMe ? <Text>MyQi</Text> : <Text>ReferQi</Text> } code</Text>
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
            <ImageBackground style={styles.qrContainerImage} source={require('../../Images/QRFrame3.png')}>
              <Image style={styles.qrImage} onError={this.onImageError.bind(this)} source={{ uri: `http://staging.api.lifekey.cnsnt.io/facial-verification?user_did=${ConsentUser.getDidSync()}&cachebust=${Date.now()}` }} />
            </ImageBackground>
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
            { this.props.connectWithMe ?
              <View style={styles.switchButtonContainer}>
                <Touchable onPress={this.onBoundPressMyCode}>
                  <View style={Object.assign({}, styles.switchButton, styles.switchButtonLeft, 
                    {"backgroundColor": this.state.informationSource === "MY CODE" ? Palette.consentBlue : Palette.consentGrayLightest})}>
                    <Text style={Object.assign({}, styles.switchButtonText, {"color": this.state.informationSource === "MY CODE" ? "white" : Palette.consentBlue})}>MyQi Code</Text>
                  </View>
                </Touchable>
                <Touchable onPress={this.onBoundPressFaceMatch}>
                  <View style={Object.assign({}, styles.switchButton, styles.switchButtonRight, {"backgroundColor": this.state.informationSource === "FACE MATCH" ? Palette.consentBlue : Palette.consentGrayLightest})}>
                    <Text style={Object.assign({}, styles.switchButtonText, {"color": this.state.informationSource === "FACE MATCH" ? "white" : Palette.consentBlue})}>FACE MATCH</Text>
                  </View>
                </Touchable>
              </View>
              :
              <View style={styles.switchButtonContainer}></View>
            }
            <View style={styles.informationContainer}>
              { this.currentInformationState() }
            </View>   
          </View>
        :
          <View style={ styles.defaultTextContainer }>
            <Text style={ styles.defaultFont }>
              Hi there, 
              {"\n\n"}
              In order to connect with others, you need a profile.
              {"\n\n"}
              Quickly set it up
            </Text>
            <Text onPress={this.onBoundPressProfile} style={ Object.assign({}, styles.defaultFont, { "color": Palette.consentBlue }) }> here.</Text>
          </View>
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
    // "flex": 1,
    "minHeight": 100,
    "flexDirection": "row",
    "width": "100%",
    "alignItems": "flex-end",
    "justifyContent": "center",
    "paddingBottom": 15
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
    "flex": 3,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "qrContainerImage":{
    "width": 225,
    "height": 225
  },
  "qrImage": {
    "width": 120,
    "height": 120,
    "marginLeft": 52.5, //-15
    "marginTop": 52.5 //+15
  },
  "textContainer": {
    "flex": 1,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "flex-start",
    "justifyContent": "flex-start",
    "paddingTop": 15,
  },
  "text":{
    "color": Palette.consentGrayDark,
    "textAlign": "center",
  },
  "defaultTextContainer":{
    "paddingTop": 50,
    "padding": Design.paddingRight*2,
  },
  "defaultFont":{
    fontFamily: Design.fonts.registration,
    fontWeight: Design.fontWeights.light,
    fontSize: 24,
    lineHeight: 28,
    color: Palette.consentOffBlack    
  }
}

export default Connect
