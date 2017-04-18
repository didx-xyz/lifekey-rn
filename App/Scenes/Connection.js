// external dependencies
import React from "react"
import { Text, View, Dimensions } from "react-native"
import { Container } from "native-base"
import * as Nachos from 'nachos-ui'
// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import HexagonIcon from "../Components/HexagonIcon"
import Scene from "../Scene"
import Util from "../Util"
import Touchable from "../Components/Touchable"
import VerifiedIcon from "../Components/VerifiedIcon"
import ConsentUser from '../Models/ConsentUser'
import Api from '../Api'

class Connection extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "isVerified": true,
      connecting: false
    }

    this.onBoundPressConnect = this.onPressConnect.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressDecline = this.onPressDecline.bind(this)
  }

  onPressConnect() {
    this.setState({
      connecting: true
    }, () => {
      Api.requestConnection({ target: this.props.route.did })
      .then(() => {
        setTimeout(() => {
          this.setState({
            connecting: false
          }, () => {
            alert(`Could not connect to ${this.props.route.display_name}`)
          })
        }, 10000) // Wait max 10 seconds
      })
      .catch(error => {
        alert(JSON.stringify(error))
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
            {/* logo goes here */}
          </View>
          <View style={styles.name}>
            <Text style={styles.nameText}>{Util.ucfirst(this.props.route.display_name)}</Text>
          </View>

          {this.state.isVerified &&
            <View style={[styles.verified, {
              position: 'relative',
            }]}>
              <View style={{
                position: 'absolute',
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
              style={styles.greetingText}>Hi there {Util.ucfirst(ConsentUser.getDisplayNameSync())}. Connecting with {Util.ucfirst(this.props.route.display_name)} will allow you to:</Text>
          </View>
          <View style={styles.actions}>
            <Text style={styles.actionsText}>• Connect your existing accounts.</Text>
            <Text style={styles.actionsText}>• Submit FICA documents in a snap.</Text>
            <Text style={styles.actionsText}>• Open a Bitcoin Wallet.</Text>
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
    "justifyContent": "center",
    "alignItems": "center"
  },
  "nameText": {
    "color": "#666",
    "fontSize": 16,
    "textAlign": "center"
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

export default Connection
