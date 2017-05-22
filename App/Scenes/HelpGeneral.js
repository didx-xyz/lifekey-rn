// external dependencies
import React from "react"
import { Text, View, Image, ScrollView, Animated, InteractionManager } from "react-native"
import Svg, { Circle } from "react-native-svg"
import { Container, Content, Col } from "native-base"
import PropTypes from "prop-types"
import GestureView from 'react-native-gesture-view' // https://github.com/glepur/react-native-swipe-gestures

// internal dependencies
import Common from "../Common"
import Routes from "../Routes"
import Scene from "../Scene"
import Palette from "../Palette"
import Touchable from "../Components/Touchable"
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import HelpIcon from "../Components/HelpIcon"
import Design from "../DesignParameters"
import Logger from "../Logger"

class HelpGeneral extends Scene {
  
  constructor(...params) {
    super(...params)

    this.state = {
      "activeScreenNumber": 0
    }

    console.log("SCREENS: ", this.props.route)
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <GestureView
          children={ this.renderHelpScreen(this.props.route.screens[this.state.activeScreenNumber]) }
          style={styles.contentContainer}
          onSwipeRight={this.onScreenGesture.bind(this, ( this.state.activeScreenNumber - 1 ))}
          onSwipeLeft={this.onScreenGesture.bind(this, ( this.state.activeScreenNumber + 1 ))} />  
        <View style={styles.buttonContainer}>
          {this.props.route.screens.map((screen, i) => {
            const colour = i === this.state.activeScreenNumber ? Palette.consentBlue : Palette.consentGrayDark
            return (  
              <View key={i} style={styles.dotContainer}>
                <View style={Object.assign({}, styles.innerdot, {"backgroundColor": colour})}></View>
              </View>
            )
          })}
          <View style={styles.skipOrFinish}>
            <Touchable onPress={this.skipOrFinish.bind(this)} >
              <Text>{ this.state.activeScreenNumber === this.props.route.screens.length - 1 ? 'Finish' : 'Skip'}</Text>
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
    if( index >= 0 && index <= this.props.route.screens.length - 1 ){
      this.setState({
        activeScreenNumber: index
      })
    }
  }

  skipOrFinish(navigatorType){
    if(this.props.route.navigationType !== "pop"){
      this.navigator.resetTo({...Routes[this.props.route.destination]})
    }
    else{
      this.navigator.pop()
    }
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

export default HelpGeneral
