import React from "react"
import Scene from "../Scene"
import Palette from "../Palette"
import Touchable from "../Components/Touchable"
import AndroidBackButton from 'react-native-android-back-button'
import BackIcon from "../Components/BackIcon"
import InfoIcon from "../Components/InfoIcon"
import Api from '../Api'
import ConsentDiscoveredUser from '../Models/ConsentDiscoveredUser'
import Logger from "../Logger"
import Session from "../Session"
import _ from 'lodash'

import {
  Text,
  View,
  ScrollView,
} from "react-native"

import {
  Container,
  Content
} from "native-base"

class ConnectionDetails extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      showHelp: false,
      colour: null,
      display_name: this.props.route.display_name,
      current_user_display_name: Session.getState().user.display_name,
      user_id: this.props.route.id,
      user_did: this.props.route.user_did
    }
  }

  async loadData() {
    try {
      const discoveredUser = await ConsentDiscoveredUser.get(this.state.user_did)
      if (discoveredUser) {
        // Fetch data to check for update
        this.setState({
          colour: discoveredUser.colour || '#ffffff',
          image_uri: discoveredUser.image_uri || null
        })
      }
      // Fetch data in case of updated
      const response = await Api.profile({ did: this.state.user_did })
      const updated = (this.state.display_name !== response.body.user.display_name)
                    || (this.state.image_uri !== response.body.user.image_uri)
                    || (this.state.colour !== response.body.user.colour)
      if (updated) {
        this.setState({
          colour: response.body.user.colour,
          image_uri: response.body.user.image_uri
        }, async () => {
          await ConsentDiscoveredUser.update({
            id: this.state.user_id,
            did: this.state.user_did,
            display_name: this.state.display_name,
            colour: response.body.user.colour,
            image_uri: response.body.user.image_uri
          })
        })
      }
    } catch (error) {
      Logger.error(error)
    }
  }

  componentWillMount() {
    super.componentWillMount()
    this.loadData()
  }

  componentWillFocus() {
    super.componentWillFocus()
    this.onAttention()
  }

  onHelpPress() {
    this.setState({
      showHelp: !this.state.showHelp
    })
  }

  goBack() {
    if (this.state.showHelp){
      this.setState({
        showHelp: false
      })
    } else {
      this.navigator.pop()
    }
  }

  onBackIconPress() {
    this.goBack()
  }

  onHardwareBack() {
    this.goBack()
    return true
  }

  render() {

    return (
      <Container>
        <Content style={styles.content}>
          <AndroidBackButton onPress={() => this.onHardwareBack()} />
          <View style={_.assign({}, styles.top, { backgroundColor: this.state.colour })}>
            <Touchable onPress={() => this.onBackIconPress()}>
              <View style={_.assign(styles.back, styles.center)}>
                  <BackIcon width={16} height={16} stroke="#fff" />
              </View>
            </Touchable>
            <View style={_.assign({}, styles.branding, styles.center)}>
              <Text style={{ color: "#fff" }}>
                {/* insert connection image */}
                {this.state.display_name}
              </Text>
            </View>
            <Touchable onPress={() => this.onHelpPress()}>
              <View style={_.assign({}, styles.help, styles.center)}>
                  <InfoIcon width={24} height={24} stroke="#fff" />
              </View>
            </Touchable>
          </View>
          <ScrollView style={styles.messages}>
            <View style={styles.message}>
              <Text style={styles.messageText}>
                Hi {this.state.current_user_display_name}. Thank you for
                connecting with {this.state.display_name}. If you are an
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
  content: {
    backgroundColor: Palette.consentGrayMedium
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 75
  },
  center: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  back: {
    flex: 1
  },
  branding: {
    flex: 4
  },
  help: {
    flex: 1
  },
  messages: {
    flex: 1,
    flexDirection: "column"
  },
  message: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 5,
    width: "65%"
  },
  messageText: {
    color: "#62686d",
    paddingRight: 15,
    fontSize: 14
  },
  messageTime: {
    color: "#c2c4c6",
    alignSelf: "flex-end",
    fontSize: 14
  },
  actions: {
    margin: 10,
    marginTop: 0,
    borderRadius: 5,
    backgroundColor: "#fff"
  },
  actionTitle: {
    backgroundColor: "#bac2ca",
    padding: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  actionTitleText: {
    textAlign: "center",
    color: "#fff"
  },
  actionList: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  actionItem: {
    width: "28%",
    paddingTop: 15,
    paddingBottom: 15
  },
  actionItemText: {
    textAlign: "center",
    backgroundColor: "transparent",
    color: "#62686d",
    fontSize: 12
  },
  helpPopover: {
    position: "absolute",
    top: 85,
    right: 10,
    bottom: 10,
    left: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10
  }
}

export default ConnectionDetails
