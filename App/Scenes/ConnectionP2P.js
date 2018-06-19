// external dependencies
import React from "react"
import { Text, View } from "react-native"
import { Container } from "native-base"
import Routes from '../Routes'
import ActivityIndicator from "ActivityIndicator"

// internal dependencies
import Api from '../Api'
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import Verification from "../Components/SceneComponents/Verification"
import Palette from "../Palette"
import Scene from "../Scene"
import Button from "../Components/Button"
import ProgressIndicator from "../Components/ProgressIndicator"

class ConnectionPeerToPeer extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      "peerConnection": "not now",
      "userHasVerified": false
    }

    this.boundOnResultGiven = this.onResultGiven.bind(this)
    this.boundOnChangeOfMind = this.onChangeOfMind.bind(this)
    this.boundOnContinue = this.onContinue.bind(this)
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
        "peerConnection": result 
      })
    })
  }
  
  onChangeOfMind() {
    this.setState({
      "asyncInProgress": false,
      "userHasVerified": false,
      "peerConnection": "not now"
    })
  }

  onContinue() {

    if(this.state.peerConnection === "not now"){
      this.navigator.replace({ ...Routes.main })
    }
    else{
      
      this.setState({
        "progressCopy": "Sending your answer...",
        "asyncInProgress": true
      }, () => {
        Api.respondConnectionRequest(
          { 
            user_connection_request_id: this.props.route.user_connection_request_id, 
            accepted: this.state.peerConnection
          })
          .then(response => {
          if(response.status >= 200 && response.status < 400 ){
            this.navigator.replace({ ...Routes.main })
          }
          else{
            console.log("peerConnection result non-200")
            this.onChangeOfMind()
          }
        })
        .catch(error => {
          console.log("peerConnection error: ", error)
        })
      })

    }
  }

  render() {
    return (
      <Container style={styles.container}>
      {
        !this.state.asyncInProgress ? 
          (this.props.route.image_uri && !this.state.userHasVerified) ?
            <Verification 
              tone="affirmative" 
              backgroundColor={ Palette.consentGrayLight }
              imageUri={ this.props.route.image_uri } 
              titleText="Peer Connection"
              messageText={`${this.props.route.display_name} would like to connect with you`}
              doubtText="Not now"
              onResultGiven={ this.onResultGiven.bind(this, "not now") }>
                <Button affirmative={false} buttonText={"No"} onClick={this.onResultGiven.bind(this, "no")} />
                <Button affirmative={true} buttonText={"Yes"} onClick={this.onResultGiven.bind(this, "yes")} />
            </Verification>
          :
            this.state.peerConnection === "yes" ?
              <Verification 
                tone="affirmative" 
                backgroundColor={ Palette.consentGrayLight }
                imageUri={ this.props.route.image_uri } 
                titleText="Connected"
                messageText={`You and ${this.props.route.display_name} can now share resources`} 
                doubtText="I would like to change my mind"
                onResultGiven={ this.boundOnChangeOfMind }>
                  <Button affirmative={true} buttonText={"Continue"} onClick={ this.boundOnContinue } />
              </Verification>
            : 
              <Verification
                tone="negative" 
                backgroundColor={ Palette.consentGrayLight }
                imageUri={ this.props.route.image_uri } 
                titleText="Request denied"
                messageText="Thank you, we will save your response" 
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

export default ConnectionPeerToPeer
