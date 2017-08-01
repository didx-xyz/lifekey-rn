
import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import Routes from '../../Routes'

// internal dependencies
import Design from "../../DesignParameters"
import Palette from '../../Palette'
import Touchable from "../Touchable"
import CircularImage from "../CircularImage"

class Verification extends Component  {

  render() {

    // console.log("VERIFICATION RENDER: ", this.props)

    const titleColour = this.props.tone === "affirmative" ? Palette.consentBlue : Palette.consentRed

    return (    
      <View style={styles.content}>

        <View style={styles.title}>
          <Text style={ Object.assign({}, styles.titleText, { "color": titleColour }) }>{ this.props.titleText }</Text>
        </View>
        
        <View style={styles.image}>
          <CircularImage uri={this.props.imageUri} radius={90} borderColor={ this.props.backgroundColor } />
        </View>
        <View style={styles.copyContainer}>
          <Text style={styles.copyText}>{ this.props.messageText }</Text>
        </View>
        <View style={styles.actions}>
          { this.props.children } 
        </View>
        <View style={styles.footer}>
          <Touchable onPress={ this.props.onResultGiven }>
            <Text style={styles.footerText}>{ this.props.doubtText }</Text>
          </Touchable>
        </View>

      </View>
    )
  }
}

const styles = {
  "content": {
    "flex": 1,
    "width": "75%",
    "justifyContent": "space-between"
  },
  "title":{
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "titleText": {
    "fontSize": 28,
    "color": Palette.consentBlue,
    "fontWeight": "300",
    "zIndex": 1,
  },
  "profileImg":{
    "width": 180,
    "height": 180
  },
  "image":{
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center",
  },
  "copyContainer":{
    "flex": 1,
    "zIndex": 1,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "copyText": {
    "fontSize": 16,
    "color": Palette.consentGrayDark,
    "textAlign": "center",
    "fontWeight": "300"
  },
  "actions":{
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "flex-start"
  },
  "button": {
    "paddingTop": Design.paddingTop,
    "paddingBottom": Design.paddingBottom,
    "paddingLeft": Design.paddingLeft * 2,
    "paddingRight": Design.paddingRight * 2,
    "borderRadius": 5
  },
  "buttonRight":{
    "marginLeft": Design.paddingTop / 2,
    "backgroundColor": Palette.consentBlue
  },
  "buttonLeft":{
    "marginRight": Design.paddingTop / 2,
    "backgroundColor": "red"
  },
  "buttonText": {
    "fontSize": 18,
    "color": "white",
    "fontWeight": "300"
  },
  "footer": {
    "flexDirection": "row",
    "height": "10%",
    "justifyContent": "center",
    "alignItems": "flex-start"
  },
  "footerText": {
    "fontSize": 16,
    "color": Palette.consentBlue,
    "fontWeight": "300"
  }
}

export default Verification
