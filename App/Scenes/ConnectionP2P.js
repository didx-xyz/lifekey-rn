// external dependencies
import React from "react"
import {
  Text,
  View,
  Dimensions,
  ToastAndroid,
  Image
} from "react-native"
import { Container } from "native-base"
import * as Nachos from 'nachos-ui'
// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import HexagonIcon from "../Components/HexagonIcon"
import Scene from "../Scene"
import Routes from "../Routes"
import Util from "../Util"
import Touchable from "../Components/Touchable"
import VerifiedIcon from "../Components/VerifiedIcon"
import ConsentUser from '../Models/ConsentUser'
import Api from '../Api'
import Logger from '../Logger'
import Session from '../Session'

class ConnectionP2P extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      isVerified: true,
      connecting: false,
    }
    this.onBoundPressConnect = this.onPressConnect.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressDecline = this.onPressDecline.bind(this)

    console.log(" ===================================== PROFILE NAME: ", this.props.route.profile)

  }

  componentWillMount() {
    super.componentWillMount()
    // this.loadActions(this.props.route.actions_url)
  }

  // async loadActions(actions_url) {
  //   if (actions_url) {
  //     Logger.info('Fetching actions')
  //     const requestOptions = {
  //       "method": "GET",
  //       "headers": {
  //         "x-cnsnt-did": Session.getState().user.did
  //       }
  //     }
  //     Logger.networkRequest('GET', actions_url, requestOptions)
  //     const actionsResponse = await fetch(actions_url, requestOptions)
  //     Logger.networkResponse(actionsResponse.status, new Date(), JSON.stringify(actionsResponse))
  //     const actions = JSON.parse(actionsResponse._bodyText)
  //     if (actions) {
  //       if (actions.body) {
  //         this.setState({
  //           actions: actions.body
  //         }, () => Logger.info('Actions updated'))
  //       } else {
  //         this.setState({
  //           actions: actions
  //         }, () => Logger.info('Actions updated'))
  //       }
  //     } else {
  //       Logger.warn('Could not parse JSON')
  //     }
  //   }
  // }

  onPressConnect() {

    ToastAndroid.show(`Connecting to ${this.props.route.profile.display_name}`, ToastAndroid.SHORT)
    this.setState({
      connecting: true
    }, () => {
      Api.requestConnection({ target: this.props.route.profile.did })
      .then(() => {
        
        ToastAndroid.show(`Connection to ${this.props.route.profile.display_name} successful!`, ToastAndroid.SHORT)
        console.log("Connection succesful!")

        this.navigator.push({
          ...Routes.connectionDetails,
          user_did: this.props.route.profile.did,
          display_name: this.props.route.profile.display_name,
          image_uri: this.props.route.profile.image_uri
        })

        // Where should this go? 

        // Connection details with one action: share resource

        // this.navigator.push({
        //   ...Routes.connectionDetails,
        //   user_did: this.props.route.profile.did,
        //   display_name: this.props.route.profile.display_name,
        //   image_uri: this.props.route.profile.image_uri
        // })
      })
      .catch(error => {
        ToastAndroid.show(`Could not connect...`, ToastAndroid.SHORT)
        Logger.warn(JSON.stringify(error))
        this.setState({
          connecting: false
        })
      })
    })
  }

  onPressHelp() {
    alert("help")
  }

  onPressDecline() {
    this.navigator.pop()
  }

  render() {
    const screenWidth = Dimensions.get('window').width
    const iconSize = screenWidth / 25

    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          <View style={styles.logo}>
            {/* logo goes here 
            <Image style={{ width: 64, height: 64, borderRadius: 45 }} source={{ uri: this.props.route.image_uri }}/> */}
            <Image style={{height: "100%", width: "100%"}} source={{ uri: this.props.route.profile.image_uri }}/> 
          </View>
          <View style={styles.name}>
            <Text style={styles.nameText}>{Util.ucfirst(this.props.route.profile.display_name)}</Text>
          </View>

          {this.state.isVerified &&
            <View style={styles.verified}>
              <View style={{
                flexDirection: 'row',
                width: 76,
                marginLeft: screenWidth / 2 - 38
              }}>

                <View style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <VerifiedIcon width={iconSize} height={iconSize} />
                </View>

                <Text style={[styles.verifiedText, { flex: 1, textAlign: 'center' }]}>Verified</Text>
              </View>


            </View>
          }

          <View style={styles.connected}>
            <Text style={styles.connectedText}>Connected to 3,421 people.</Text>
          </View>
          <View style={styles.greeting}>
            <Text
              style={styles.greetingText}>Hi there {Util.ucfirst(ConsentUser.getDisplayNameSync())}. Connecting with {Util.ucfirst(this.props.route.profile.display_name)} will allow you to share and verify resources.</Text>
          </View>
          <View style={styles.connect}>
            { this.state.connecting ?
              <Nachos.Spinner color="blue"/>
            :
              <Touchable onPress={this.onBoundPressConnect}>
                <View>
                  <HexagonIcon width={100} height={100} textSize={19} textX={18} textY={39} text="Connect" />
                </View>
              </Touchable>
            }
          </View>
          <View style={styles.footer}>
            <View style={styles.help}>
              <Touchable onPress={this.onBoundPressHelp}>
                <HelpIcon width={28} height={28} stroke="#666" />
              </Touchable>
            </View>
            <View style={styles.decline}>
              <Touchable onPress={this.onBoundPressDecline}>
                <Text style={styles.declineText}>Not now</Text>
              </Touchable>
            </View>
          </View>
        </View>
      </Container>
    )
  }
}

const styles = {
  "content": {
    "flex": 1,
    "backgroundColor": "#c6cdd3"
  },
  "logo": {
    "height": "13%",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "name": {
    "height": "5%",
    flexDirection: "column",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "nameText": {
    "color": "#666",
    "fontSize": 18,
    "textAlign": "center",
    marginTop: 5
  },
  "verified": {
    "height": "3%"
  },
  "verifiedText": {
    "color": "#666",
  },
  "connected": {
    "height": "3%",
    "justifyContent": "center",
    "alignItems": "center",
    "marginTop": "2%"
  },
  "connectedText": {
    "color": "#666"
  },
  "greeting": {
    "height": "17%",
    "justifyContent": "flex-end",
    "flexDirection": "column",
    "paddingLeft": "17%",
    "paddingRight": "17%",
    "paddingBottom": "5%"
  },
  "greetingText": {
    "textAlign": "center",
    "width": "100%",
    "color": "#999",
    "fontSize": 15
  },
  "actions": {
    "height": "17%",
    "alignItems": "center",
    "paddingLeft": "17%",
    "paddingRight": "17%"
  },
  "actionsText": {
    "textAlign": "left",
    "width": "100%",
    "color": "#666",
    "marginTop": 5
  },
  "connect": {
    "height": "25%",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "footer": {
    "height": "17%",
    "flexDirection": "row",
    "alignItems": "center",
    "paddingLeft": "12%",
    "paddingRight": "12%"
  },
  "help": {
    "flex": 1,
    "justifyContent": "flex-start"
  },
  "decline": {
    "flex": 1,
    "justifyContent": "flex-end"
  },
  "declineText": {
    "color": "#666",
    "textAlign": "right"
  }
}

export default ConnectionP2P