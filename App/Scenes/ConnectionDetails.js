import React from "react"
import Scene from "../Scene"
import Session from "../Session"
import Palette from "../Palette"
import Routes from "../Routes"
import Config from "../Config"
import LifekeyHeader from "../Components/LifekeyHeader"
import LifekeyCard from "../Components/LifekeyCard"
import Touchable from "../Components/Touchable"
import AndroidBackButton from 'react-native-android-back-button'
import BackIcon from "../Components/BackIcon"
import InfoIcon from "../Components/InfoIcon"
import Api from '../Api'
import ConsentDiscoveredUser from '../Models/ConsentDiscoveredUser'

import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image
} from "react-native"

import {
  Container,
  Content
} from "native-base"

class ConnectionDetails extends Scene {
  constructor(...params) {
    super(...params)

    this.connection_to = this.props.route.connection_to
    this.connection_id = this.props.route.connection_id

    this.state = {
      "showHelp": false,
      colour: null,
      nickname: null,
      user_id: null,
      user_did: null
    }

    this.onHelpPress = this.onHelpPress.bind(this)
  }

  componentWillMount() {
    super.componentWillMount()
    ConsentDiscoveredUser.get(this.props.route.connection_to)
    .then(discoveredUser => {
      if (discoveredUser) {
        this.setState({
          colour: discoveredUser.colour,
          nickname: discoveredUser.nickname,
          user_id: discoveredUser.id
        })
        return new Promise.reject(null)
      } else {
        return Api.profile({ id: this.props.route.connection_to })
      }

    })
    .then(response => {
      this.setState({
        id: response.body.user.id,
        colour: response.body.user.colour,
        nickname: response.body.user.nickname,
        did: response.body.user.did,
        image_uri: response.body.image_uri
      })
      return ConsentDiscoveredUser.add(
        response.body.user.id,
        response.body.user.did,
        response.body.user.nickname,
        response.body.user.colour,
        response.body.image_uri
      )
    })
    .catch(error => {
      if (error !== null) {
        alert(JSON.stringify(error))
        console.error(error)
        throw new Error(error.toString())
      }
    })
    this.onAttention()
  }

  componentWillFocus() {
    super.componentWillFocus()
    this.onAttention()
  }

  onAttention() {

  }

  onHelpPress() {
    this.setState({
      "showHelp": !this.state.showHelp
    })
  }

  onHardwareBack() {
    this.navigator.pop()
    return true
  }

  render() {
    const top = {
      "backgroundColor": this.state.colour
    }

    const text = {
      "color": "#fff"
    }

    return (
      <Container>
        <Content style={styles.content}>
          <AndroidBackButton onPress={() => this.onHardwareBack()} />
          <View style={Object.assign(styles.top, top)}>
            <Touchable onPress={() => this.navigator.pop()}>
              <View style={Object.assign(styles.back, styles.center)}>
                  <BackIcon width={16} height={16} stroke="#fff" />
              </View>
            </Touchable>
            <View style={Object.assign(styles.branding, styles.center)}>
              <Text style={text}>
                {/* insert connection image */}
                ABSA Bank
              </Text>
            </View>
            <Touchable onPress={this.onHelpPress}>
              <View style={Object.assign(styles.help, styles.center)}>
                  <InfoIcon width={24} height={24} stroke="#fff" />
              </View>
            </Touchable>
          </View>
          <ScrollView style={styles.messages}>
            <View style={styles.message}>
              <Text style={styles.messageText}>
                Hi Jacques. Thank you for
                connecting with Absa. If you are an
                existing customer, we invite you to
                confirm your bank details
                and save this information to your
                personal data.
              </Text>
              <Text style={styles.messageTime}>
                2 mins
              </Text>
            </View>
            <View style={styles.actions}>
              <View style={styles.actionTitle}>
                <Text style={styles.actionTitleText}>Invitations from Absa Bank</Text>
              </View>
              <View style={styles.actionList}>
                <View style={styles.actionItem}>
                  {/* insert action image */}
                  <Text style={styles.actionItemText}>Connect My Accounts</Text>
                </View>
                <View style={styles.actionItem}>
                  {/* insert action image */}
                  <Text style={styles.actionItemText}>Submit FICA</Text>
                </View>
                <View style={styles.actionItem}>
                  {/* insert action image */}
                  <Text style={styles.actionItemText}>New Bitcoin Wallet</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {this.state.showHelp &&
            <ScrollView style={styles.helpPopover}>
              <Text>
                This is some help text.
              </Text>
            </ScrollView>
          }
        </Content>
      </Container>
    )
  }
}

const styles = {
  "content": {
    "backgroundColor": Palette.consentGrayMedium
  },
  "top": {
    "flexDirection": "row",
    "justifyContent": "space-between",
    "height": 75
  },
  "center": {
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "back": {
    "flex": 1
  },
  "branding": {
    "flex": 4
  },
  "help": {
    "flex": 1
  },
  "messages": {
    "flex": 1,
    "flexDirection": "column"
  },
  "message": {
    "backgroundColor": "#fff",
    "margin": 10,
    "padding": 10,
    "borderRadius": 5,
    "width": "65%"
  },
  "messageText": {
    "color": "#62686d",
    "paddingRight": 15,
    "fontSize": 14
  },
  "messageTime": {
    "color": "#c2c4c6",
    "alignSelf": "flex-end",
    "fontSize": 14
  },
  "actions": {
    "margin": 10,
    "marginTop": 0,
    "borderRadius": 5,
    "backgroundColor": "#fff"
  },
  "actionTitle": {
    "backgroundColor": "#bac2ca",
    "padding": 15,
    "borderTopLeftRadius": 5,
    "borderTopRightRadius": 5
  },
  "actionTitleText": {
    "textAlign": "center",
    "color": "#fff"
  },
  "actionList": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "borderBottomLeftRadius": 5,
    "borderBottomRightRadius": 5
  },
  "actionItem": {
    "width": "28%",
    "paddingTop": 15,
    "paddingBottom": 15
  },
  "actionItemText": {
    "textAlign": "center",
    "backgroundColor": "transparent",
    "color": "#62686d",
    "fontSize": 12
  },
  "helpPopover": {
    "position": "absolute",
    "top": 85,
    "right": 10,
    "bottom": 10,
    "left": 10,
    "backgroundColor": "#fff",
    "borderRadius": 5,
    "padding": 10
  }
}

export default ConnectionDetails
