// external dependencies
import React from "react"
import { Text, View, ToastAndroid } from "react-native"
import AndroidBackButton from 'react-native-android-back-button'
import { Container } from "native-base"
import Routes from '../Routes'
import ActivityIndicator from "ActivityIndicator"

// internal dependencies
import Api from '../Api'
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import Verification from "../Components/SceneComponents/Verification"
import Common from "../Common"
import Palette from "../Palette"
import Scene from "../Scene"
import Button from "../Components/Button"
import ProgressIndicator from "../Components/ProgressIndicator"

class ConnectionPeerToPeerRequest extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      "progressCopy": "Fetching connection details...",
      "asyncInProgress": true,
      "peerRequest": "not now",
      "userHasVerified": false
    }

    this.boundOnResultGiven = this.onResultGiven.bind(this)
    this.boundOnChangeOfMind = this.onChangeOfMind.bind(this)
    this.boundOnContinue = this.onContinue.bind(this)
    this.boundOnCancel = this.onCancel.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()
    Api.profile({ did: this.props.route.profile.did }).then(result => {
      
      let profile = result.body.user
      profile.image_uri = Common.ensureDataUrlHasContext(profile.image_uri)

      this.setState({
        "asyncInProgress": false,
        "profile": profile
      })

    })
  }

  onResultGiven(result){
    if(result === "not now"){
      this.navigator.pop()
    }
    else{
      
      // TODO - Fix this MAGNIFICENT BUG
      // Two setstates are called here - the first being seemingly useless. However, if on the callback setstate is called in isolation
      // then the Verification component styling falls to pieces, as does it's rendering of its props.children (Button components)... 

      this.setState({
        "asyncInProgress": true
      }, () => {
        this.setState({
          "asyncInProgress": false,
          "userHasVerified": true,
          "peerRequest": result 
        })
      })
    }
  }

  onChangeOfMind() {
    this.setState({
      "asyncInProgress": false,
      "userHasVerified": false,
      "peerRequest": "not now"
    })
  }

  onCancel() {
    this.navigator.pop()
    return true
  }

  onContinue() {

    this.setState({
      "progressCopy": "Sending your request...",
      "asyncInProgress": true
    }, () => {
      Api.requestConnection({ target: this.state.profile.did })
        .then(response => {

        if(response.status >= 200 && response.status < 400 ){
          this.navigator.pop()
        }
        else{
          this.onError("")
        }
      })
      .catch(error => {
        this.setState({ "asyncInProgress": false}, () => {
          this.onError("")
        })
      })
    })

  }

  onError(errorMessage){
    ToastAndroid.show(`There was an issue requesting a connection... ${errorMessage}`, ToastAndroid.LONG)
    this.onChangeOfMind()
  }

  render() {
    return (
      <Container style={styles.container}>
      <AndroidBackButton onPress={() => this.onCancel()} />
      {
        !this.state.asyncInProgress ? 
          (this.state.profile && !this.state.userHasVerified) ?
            <Verification 
              tone="affirmative" 
              backgroundColor={ Palette.consentGrayLight }
              imageUri={ this.state.profile.image_uri } 
              titleText="Peer Connection"
              messageText={`Would you like to connect with ${this.state.profile.display_name}`}
              doubtText="Not now"
              onResultGiven={ this.onResultGiven.bind(this, "not now") }>
                <Button affirmative={false} buttonText={"No"} onClick={this.onResultGiven.bind(this, "no")} />
                <Button affirmative={true} buttonText={"Yes"} onClick={this.onResultGiven.bind(this, "yes")} />
            </Verification>
          :
            this.state.peerRequest === "yes" ?
              <Verification 
                tone="affirmative" 
                backgroundColor={ Palette.consentGrayLight }
                imageUri={ this.state.profile.image_uri } 
                titleText="Request ready!"
                messageText={`Send connection request to ${this.state.profile.display_name}?`} 
                doubtText="I would like to change my mind"
                onResultGiven={ this.boundOnChangeOfMind }>
                  <Button affirmative={true} buttonText={"Continue"} onClick={ this.boundOnContinue } />
              </Verification>
            : 
              <Verification
                tone="negative" 
                backgroundColor={ Palette.consentGrayLight }
                imageUri={ this.state.profile.image_uri } 
                titleText="Request cancelled"
                messageText="Thank you" 
                doubtText="I would like to change my mind"
                onResultGiven={ this.boundOnChangeOfMind }>
                  <Button affirmative={true} buttonText={"Continue"} onClick={ this.boundOnCancel } />
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

export default ConnectionPeerToPeerRequest
