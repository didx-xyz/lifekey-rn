// external dependencies
import React from "react"
import { Text, View, Image, ScrollView, Animated, InteractionManager } from "react-native"
import Svg, { Circle } from "react-native-svg"
import { Container, Content, Col } from "native-base"
import PropTypes from "prop-types"
import GestureView from 'react-native-gesture-view' // https://github.com/glepur/react-native-swipe-gestures

// internal dependencies
import Common from "../../Common"
import Routes from "../../Routes"
import Scene from "../../Scene"
import Palette from "../../Palette"
import Touchable from "../../Components/Touchable"
import BackButton from "../../Components/BackButton"
import BackIcon from "../../Components/BackIcon"
import HelpIcon from "../../Components/HelpIcon"
import Design from "../../DesignParameters"
import Logger from "../../Logger"

class HelpScreens extends Scene {
  
  constructor(...params) {
    super(...params)

    this.state = {
      "screens": [ 
        { "image": require("../../Images/onboarding_test.png"), "heading": "Identify", "copy": "Qi Identity is my digital passport" }, 
        { "image": require("../../Images/qr.png"), "heading": "Connect", "copy": "Qi Code connects me in a snap & replaces paperwork" }, 
        { "image": require("../../Images/phone.png"), "heading": "Access", "copy": "Qi Access magically logs me in without usernames & passwords" }, 
        { "image": require("../../Images/share.png"), "heading": "Secure", "copy": "Qi Safe secures my personal information under my control" }, 
        { "image": require("../../Images/rewards.png"), "heading": "Rewards", "copy": "Qi Rewards give me Thanks Points and personalised offers" }
      ],
      "activeScreenNumber": 0
    }
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <GestureView
          children={ this.renderHelpScreen(this.state.screens[this.state.activeScreenNumber]) }
          style={styles.contentContainer}
          onSwipeRight={this.onScreenGesture.bind(this, ( this.state.activeScreenNumber - 1 ))}
          onSwipeLeft={this.onScreenGesture.bind(this, ( this.state.activeScreenNumber + 1 ))} />  
        <View style={styles.buttonContainer}>
          {this.state.screens.map((screen, i) => {
            const colour = i === this.state.activeScreenNumber ? Palette.consentBlue : Palette.consentGrayDark
            return (  
              <View key={i} style={styles.dotContainer}>
                <View style={Object.assign({}, styles.innerdot, {"backgroundColor": colour})}></View>
              </View>
            )
          })}
          <View style={styles.skipOrFinish}>
            <Touchable onPress={this.skipOrFinish.bind(this)} >
              <Text>{ this.state.activeScreenNumber === this.state.screens.length - 1 ? 'Finish' : 'Skip'}</Text>
            </Touchable>
            </View>
        </View>  
      </Container>
    )
  }

  renderHelpScreen(screenData) {
    return ( 
      <Touchable onPress={this.onScreenGesture.bind(this, ( this.state.activeScreenNumber + 1 ))}>
        <View style={styles.innerContentContainer}>
          <View style={styles.imageContainer}>
            <Image style={{"width" : 300, "height": 300}} source={screenData.image} />
          </View>   
          <View style={styles.textContainer}>
            <Text style={styles.heading}>{screenData.heading}</Text>
            <Text style={styles.copy}>{screenData.copy}</Text>
          </View>  
        </View>
      </Touchable>
    )
  }

  onScreenGesture(index) {
    if( index >= 0 && index <= this.state.screens.length - 1 ){
      this.setState({
        activeScreenNumber: index
      })
    }
  }

  skipOrFinish(){
    this.navigator.replace({...Routes.me})
  }

}

const styles = {

  "headerWrapper": {
    "borderColor": Palette.consentGrayDark,
    "height": Design.lifekeyHeaderHeight
  },
  "contentContainer":{
    "flex": 4,
    "backgroundColor": "white",
    "alignItems": "stretch",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  "innerContentContainer":{
    "flex": 1,
    "alignItems": "stretch",
    "justifyContent": "center"
  },
  "imageContainer": {
    "flex": 6,
    "justifyContent": "center",
    "alignItems": "center",
  },
  "textContainer": {
    "flex": 3,
    "justifyContent": "flex-start",
    "alignItems": "center"
  },
  "heading":{
    "fontSize": 40,
    "color": Palette.consentBlue,
    "marginTop": 12,
    "marginBottom": 12, 
    "textAlign": "center"
  },
  "copy":{
    "textAlign": "center",
    "fontSize": 18,
  },
  "buttonContainer": {
    "flex": 1,
    "width": "100%",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "dotContainer":{
    "width": "8%",
    "justifyContent": "center",
    "alignItems": "center",
  },
  "innerdot":{
    "borderRadius": 4,
    "width": 8,
    "height": 8
  },
  "skipOrFinish":{
    "position": "absolute",
    "right": "15%"
  },
  "svgDotContainer": {
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center",
  }
}

export default HelpScreens
