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
  }

  componentDidMount() {
    super.componentDidMount()
    Api.profile({ did: this.props.route.profile.did }).then(result => {
      
      let profile = result.body.user
      profile.image_uri = Common.ensureDataUrlHasContext(profile.image_uri)

      console.log("PROFILE ISA: ", profile.image_uri)

      this.setState({
        "asyncInProgress": false,
        "profile": profile
      })

    })

  }

  onResultGiven(result){
    this.setState({
      "asyncInProgress": false,
      "userHasVerified": true,
      "peerRequest": result 
    })
  }

  onChangeOfMind() {
    this.setState({
      "asyncInProgress": false,
      "userHasVerified": false,
      "peerRequest": "not now"
    })
  }

  onContinue() {

    if(this.state.peerRequest === "not now"){
      this.navigator.replace({ ...Routes.main })
    }
    else{
      
      this.setState({
        "progressCopy": "Sending your request...",
        "asyncInProgress": true
      }, () => {
        Api.requestConnection({ target: this.state.profile.did })
          .then(response => {

            console.log("RESPONSE: ", response)

          if(response.status >= 200 && response.status < 400 ){
            this.navigator.replace({ ...Routes.main })
          }
          else{
            console.log("peerRequest result non-200")
            this.onChangeOfMind()
          }
        })
        .catch(error => {
          console.log("peerRequest error: ", error)
        })
      })

    }
  }

  render() {
    return (
      <Container style={styles.container}>
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
                messageText={`Connection request sent to ${this.state.profile.display_name}`} 
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

export default ConnectionPeerToPeerRequest
