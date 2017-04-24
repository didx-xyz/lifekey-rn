// external dependencies
import React from "react"
import { Text, View, Image } from "react-native"
import { Container } from "native-base"

// internal dependencies
import Api from '../Api'
import ConsentUser from '../Models/ConsentUser'
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import Design from "../DesignParameters"
import Palette from "../Palette"
import Scene from "../Scene"
import LifekeyHeader from "../Components/LifekeyHeader"
import Touchable from "../Components/Touchable"
import Button from "../Components/Button"

class FaceMatch extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "imageAvailable": false, 
      "imageDataUrl": "" 
    }

    this.onBoundPressYes = this.onPressYes.bind(this)
    this.onBoundPressNo = this.onPressNo.bind(this)
    this.onBoundPressUnsure = this.onPressUnsure.bind(this)
  }

  componentDidMount() {
    this.loadImage()
  }

  onPressYes() {
    alert("yes")
  }

  onPressNo() {
    alert("no")
  }

  onPressUnsure() {
    alert("unsure")
  }

  async loadImage() {
    try{
      const userdid = ConsentUser.getDidSync()
      const response = await Api.facialVerificationQrScanResponse(userdid)
      
      this.setState({
        "imageAvailable": true,
        "imageDataUrl": `data:${response.body.mime};${response.body.encoding},${response.body.value}`
      })
      
    }
    catch(e){
      console.log("ERROR: ", e)
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
          <BackButton navigator={this.navigator} />
          <Touchable onPress={this.onPressBottomLeftButton}>
            <BackIcon { ...Design.backIcon } />
          </Touchable>
        </View>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Facial Verification</Text>
          </View>
          <View style={styles.image}>
            {/* Image goes here */}
            { this.state.imageAvailable && <Image style={styles.profileImg} source={{ uri: this.state.imageDataUrl, scale: 1 }} /> }
          </View>
          <View style={styles.copyContainer}>
            <Text style={styles.copyText}>Is this the person who's QR Code you scanned?</Text>
          </View>
          <View style={styles.actions}>
            <Button affirmative={false} buttonText={"No"} onClick={this.onBoundPressNo} />
            <Button affirmative={true} buttonText={"Yes"} onClick={this.onBoundPressYes} />
          </View>
          <View style={styles.footer}>
            <Touchable onPress={this.onBoundPressUnsure}>
              <Text style={styles.footerText}>I'm not sure</Text>
            </Touchable>
          </View>
        </View>
      </Container>
    )
  }
}

const styles = {
  "container":{
    "backgroundColor": Palette.consentGrayLight,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "header": {
    "height": "10%",
    "width": "100%",
    "flexDirection": "row",
    "justifyContent": "flex-start",
    "alignItems": "center",
    "paddingLeft": Design.paddingLeft
  },
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
    "fontWeight": "300"
  },
  "profileImg":{
    "width": 75,
    "height": 75
  },
  "image":{
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center",
  },
  "copyContainer":{
    "flex": 1,
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

export default FaceMatch
