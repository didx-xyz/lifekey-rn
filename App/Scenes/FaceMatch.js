// external dependencies
import React from "react"
import { Text, View } from "react-native"
import { Container } from "native-base"
import Routes from '../Routes'
import ActivityIndicator from "ActivityIndicator"

// internal dependencies
import Api from '../Api'
import AndroidBackButton from 'react-native-android-back-button'
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import Verification from "../Components/SceneComponents/Verification"
import Palette from "../Palette"
import Scene from "../Scene"
import Button from "../Components/Button"
import ProgressIndicator from "../Components/ProgressIndicator"

class FaceMatch extends Scene {
  
  constructor(...params) {
    super(...params)

    this.state = {
      "progressCopy": "Loading...",
      "asyncInProgress": true, 
      "imageDataUrl": "" 
    }

    this.boundOnResultGiven = this.onResultGiven.bind(this)
    this.boundOnChangeOfMind = this.onChangeOfMind.bind(this)
    this.boundOnContinue = this.onContinue.bind(this)
  }

  componentDidMount() {
    this.loadImage()
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
        "asyncInProgress": false,
        "imageDataUrl": url,
        "userDid": userdid,
        "userToken": token
      })
      
    }
    catch(e){
      console.log("ERROR: ", e)
    }
  }

  onResultGiven(result){
    

    // TODO - Fix this MAGNIFICENT BUG
    // Two setstates are called here - the first being seemingly useless. However, if on the callback setstate is called in isolation
    // then the Verification component styling falls to pieces, as does it's rendering of its props.children (Button components)... 

    this.setState({
      "asyncInProgress": true
    }, () => {
      this.setState({
        "asyncInProgress": false,
        "userHasVerified": true,
        "faceMatch": result 
      })
    })
  }

  
  onChangeOfMind() {
    this.setState({
      "asyncInProgress": false,
      "userHasVerified": false,
      "faceMatch": null
    })
  }

  onContinue() {

    this.setState({
      "progressCopy": "Sending your answer...",
      "asyncInProgress": true
    }, () => {
      Api.facialVerificationResult(this.state.userDid, this.state.userToken, this.state.faceMatch).then(response => {
        if(response.status === 200){
          this.navigator.replace({ ...Routes.main })
        }
        else{
          console.log("Facematch result non-200")
          this.onChangeOfMind()
        }
      })
      .catch(error => {
        console.log("Facematch error: ", error)
      })
    })
  }

  

  onCancel() {
    this.navigator.pop()
    return true
  }

  render() {
    return (
      <Container style={styles.container}>
      <AndroidBackButton onPress={() => this.onCancel()} />
      {
        !this.state.asyncInProgress ? 
          (this.state.imageDataUrl && !this.state.userHasVerified) ?
            <Verification 
              tone="affirmative" 
              backgroundColor={ Palette.consentGrayLight }
              imageUri={ this.state.imageDataUrl } 
              titleText="Facial Verification"
              messageText="Is this the person who's QR Code you scanned?" 
              doubtText="I'm not sure"
              onResultGiven={ this.onResultGiven.bind(this, "not sure") }>
                <Button affirmative={false} buttonText={"No"} onClick={this.onResultGiven.bind(this, "no")} />
                <Button affirmative={true} buttonText={"Yes"} onClick={this.onResultGiven.bind(this, "yes")} />
            </Verification>
          :
            this.state.faceMatch === "yes" ?
              <Verification 
                tone="affirmative" 
                backgroundColor={ Palette.consentGrayLight }
                imageUri={ this.state.imageDataUrl } 
                titleText="Matched"
                messageText="Thank you for your response." 
                doubtText="I would like to change my mind"
                onResultGiven={ this.boundOnChangeOfMind }>
                  <Button affirmative={true} buttonText={"Continue"} onClick={ this.boundOnContinue } />
              </Verification>
            : 
              <Verification
                tone="negative" 
                backgroundColor={ Palette.consentGrayLight }
                imageUri={ this.state.imageDataUrl } 
                titleText="No result"
                messageText="Thank you, we have recorded your response and will follow up." 
                doubtText="I would like to change my mind"
                onResultGiven={ this.boundOnChangeOfMind }>
                  <Button affirmative={true} buttonText={"Continue"} onClick={ this.boundOnContinue } />
              </Verification>
        :
          <ProgressIndicator progressCopy={ this.state.progressCopy }></ProgressIndicator>
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
  }
}

export default FaceMatch
