// external dependencies
import React from "react"
import { Text, View, Image } from "react-native"
import { Container } from "native-base"
import Routes from '../Routes'
import ActivityIndicator from "ActivityIndicator"

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
      "progressCopy": "Loading...",
      "imageAvailable": false, 
      "imageDataUrl": "" 
    }
  }

  componentDidMount() {
    this.loadImage()
  }

  async onResultGiven(result){
    const response = await Api.facialVerificationResult(this.state.userDid, this.state.userToken, result)
    if(response.status === 200)
      this.navigator.replace({
        ...Routes.me
      })
  }

  async loadImage() {
    try{

      const urlPieces = this.props.route.url.split("/")
      const userdid = urlPieces[urlPieces.length - 2]
      const token = urlPieces[urlPieces.length - 1]

      const response = await Api.facialVerificationQrScanResponse(userdid, token)
      
      const time = new Date()
      const parsedValue = JSON.parse(response.body.value); 
      console.log("Time spent waiting : ", (Date.now() - time.getTime())*1000)

      const url = `data:image/jpeg;base64,${parsedValue.identityPhotograph}}`

      this.setState({
        "imageAvailable": true,
        "imageDataUrl": url,
        "userDid": userdid,
        "userToken": token
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
          { /* <BackButton navigator={this.navigator} />
          <Touchable onPress={this.onPressBottomLeftButton}>
            <BackIcon { ...Design.backIcon } />
          </Touchable> */}
        </View> 
        {
          this.state.imageAvailable ? 
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
                <Button affirmative={false} buttonText={"No"} onClick={this.onResultGiven.bind(this, "no")} />
                <Button affirmative={true} buttonText={"Yes"} onClick={this.onResultGiven.bind(this, "yes")} />
              </View>
              <View style={styles.footer}>
                <Touchable onPress={this.onResultGiven.bind(this, "not sure")}>
                  <Text style={styles.footerText}>I'm not sure</Text>
                </Touchable>
              </View>
          </View>
        :
          <View style={styles.progressContainer}>
            <ActivityIndicator color={Palette.consentBlue} style={styles.progressIndicator}/> 
            <Text style={styles.progressText}>{this.state.progressCopy}</Text>
          </View>
        }
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
  "progressContainer": {
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "progressIndicator": {
    "width": 75,
    "height": 75 
  },
  "progressText":{
    "color": Palette.consentGrayDark
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
    "width": 175,
    "height": 175
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
