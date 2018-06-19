// external dependencies
import React from "react"
import { ToastAndroid } from "react-native"
import AndroidBackButton from 'react-native-android-back-button'
import { Container } from "native-base"
import Routes from '../Routes'

// internal dependencies
import Api from '../Api'
import ConsentUser from "../Models/ConsentUser"
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import Verification from "../Components/SceneComponents/Verification"
import Common from "../Common"
import Palette from "../Palette"
import Scene from "../Scene"
import Button from "../Components/Button"
import ProgressIndicator from "../Components/ProgressIndicator"
import Toast from '../Utils/Toast'

class ConnectionPeerToPeerDelete extends Scene {

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
      
      Api.deleteConnection({user_connection_id: this.props.route.user_connection_id})
         .then(response => {

           if(response.status >= 200 && response.status < 400 ){
              ConsentUser.removeEnabledPeerConnection(this.props.route.user_connection_id)
              Toast.show("Connection deleted...", ToastAndroid.LONG)
              this.navigator.replace({ ...Routes.main })
            }
            else{
              this.onError("")
            }

         })
         .catch(error => {
          console.log("DELETE ERROR: ", JSON.stringify(error))
           Toast.show(`Something went wrong. Please try again...`, ToastAndroid.SHORT)
         })

    })

  }

  onError(errorMessage){
    Toast.show(`There was an issue deleting this connection... ${errorMessage}`, ToastAndroid.LONG)
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
              messageText={`Would you like to disconnect from ${this.state.profile.display_name}`}
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
                titleText="Remove now"
                messageText={`Are you sure?`} 
                doubtText="I would like to change my mind"
                onResultGiven={ this.boundOnChangeOfMind }>
                  <Button affirmative={true} buttonText={"Continue"} onClick={ this.boundOnContinue } />
              </Verification>
            : 
              <Verification
                tone="negative" 
                backgroundColor={ Palette.consentGrayLight }
                imageUri={ this.state.profile.image_uri } 
                titleText="Disconnection cancelled"
                messageText={`You and ${this.state.profile.display_name} are still connected`}
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

export default ConnectionPeerToPeerDelete
