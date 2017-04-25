import React from "react"
import Scene from "../Scene"
import Palette from "../Palette"
import Touchable from "../Components/Touchable"
import AndroidBackButton from 'react-native-android-back-button'
import BackIcon from "../Components/BackIcon"
import InfoIcon from "../Components/InfoIcon"
import HelpIcon from "../Components/HelpIcon"
import Api from '../Api'
import ConsentDiscoveredUser from '../Models/ConsentDiscoveredUser'
import Logger from "../Logger"
import Session from "../Session"
import _ from 'lodash'
import LifekeyHeader from '../Components/LifekeyHeader'
import Design from '../DesignParameters'
import Config from '../Config'
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  Image
} from "react-native"

import {
  Container,
  Content
} from "native-base"

import ISACard from '../Components/ISACard'

const CONNECT = 0
const ACTIVITY = 1
const SHARED = 2
const HELP = 3

class ConnectionDetails extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: ACTIVITY,
      showHelp: false,
      colour: null,
      foregroundColor: 'white',
      image_uri: null,
      actions_url: null,
      address: null,
      email: null,
      actions: [],
      display_name: this.props.route.display_name,
      current_user_display_name: Session.getState().user.display_name,
      connection_id: this.props.route.id, // id of the connection request
      user_did: this.props.route.user_did // did of the user connected to
    }
  }

  async loadActions(actions_url) {
    if (actions_url) {
      Logger.info('Fetching actions')
      const actionsResponse = await fetch(actions_url, { method: 'GET' })
      const actionsJSON = JSON.parse(actionsResponse._bodyText)
      if (actionsJSON) {
        this.setState({
          actions: actionsJSON
        })
      }
    }
  }

  async loadData() {
    try {
      const response = await Api.profile({ did: this.state.user_did })
      this.loadActions(response.body.user.actions_url)
      this.setState({
        colour: response.body.user.colour,
        image_uri: response.body.user.image_uri,
        actions_url: response.body.actions_url,
        address: response.body.user.address,
        email: response.body.user.email
      })
    } catch (error) {
      Logger.warn(error)
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
    if (this.state.showHelp) {
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

  renderTab() {
    switch (this.state.activeTab) {
      case CONNECT:
        return (
          <View style={{ height: Dimensions.get('window').height - Design.lifekeyHeaderHeight }}>

            <View style={styles.qrCodeWrap}>
              <Image
                source={{uri: `${Config.http.baseUrl}/qr/${this.state.user_did}` }}
                style={{ width: 200, height: 200 }}
              />
            </View>

            <View style={styles.connectHelpTextWrap}>
              <Text style={{ textAlign: 'center' }}>
                Invite other people to connect with you by sharing your unique code.
              </Text>
            </View>

            <View style={styles.connectFooterWrap}>
              <View style={styles.centered}>
                <Touchable onPress={() => alert('todo')}>
                  <View>
                    <HelpIcon width={36} height={36}/>
                  </View>
                </Touchable>
              </View>
              <View style={{ flex: 2 }}/>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Touchable onPress={() => alert('todo')}>
                  <Text style={{ fontSize: 18, marginRight: 20 }}>Share</Text>
                </Touchable>
              </View>
            </View>

          </View>
        )
      case ACTIVITY:
      return (
        <ScrollView style={styles.messages}>
          <View style={styles.message}>
            <Text style={styles.messageText}>
              Hi {this.state.current_user_display_name}. Thank you for
              connecting with {this.state.display_name}. If you are an
              existing customer, we invite you to
              confirm your details
              and save this information to your
              personal data.
            </Text>
            <Text style={styles.messageTime}>
              2 mins
            </Text>
          </View>
          <View style={styles.actions}>
            <View style={styles.actionTitle}>
              <Text style={styles.actionTitleText}>Invitations from {this.state.display_name}</Text>
            </View>
            <View style={styles.actionList}>
              {this.state.actions.map((action, i) =>
                <View key={i} style={styles.actionItem}>
                  <Text style={styles.actionItemText}>{action.name}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        )
      case SHARED:
      return (
        <View style={{ flex: 1 , paddingLeft: Design.paddingLeft, paddingRight: Design.paddingRight }}>
          <Text style={_.assign({}, styles.actionTitleText, { color: "#888", padding: 10 })}>
            Your share the following personal data with
            <Text style={{ fontWeight: 'bold' }}>
              {' ' + this.state.display_name}
            </Text>
          </Text>

          <ISACard
            title="ONBOARDING AS A NEW CUSTOMER"
            shared={[
              "Personal Identity",
              "Verified Identity"
            ]}
            terms={[
              { icon: <Text>ic</Text>, text: "12 Months" },
              { icon: <Text>ic</Text>, text: "In SA" },
              { icon: <Text>ic</Text>, text: "Marketing" }
            ]}
            date="23-02-2017"
            expires="23-02-2018"
          />
          <ISACard
            title="ANOTHER ITEM"
            shared={[
              "Some information",
              "Some other information",
              "Some more information"
            ]}
            terms={[
              { icon: <Text>ic</Text>, text: "6 Months" },
              { icon: <Text>ic</Text>, text: "Something" }
            ]}
            date="23-02-2017"
            expires="23-02-2018"
          />
          <ISACard
            title="ANOTHER ITEM"
            shared={[
              "Some information",
              "Some other information",
              "Some more information"
            ]}
            terms={[
              { icon: <Text>ic</Text>, text: "6 Months" },
              { icon: <Text>ic</Text>, text: "Something" }
            ]}
            date="23-02-2017"
            expires="23-02-2018"
          />
        </View>
      )
      case HELP:
      return (
        <View style={{ flex: 1 }}>
          <View style={{
            backgroundColor: 'white',
            margin: Design.paddingLeft,
            borderRadius: Design.borderRadius
          }}>
            <Text style={{ padding: 10 }}>
              <Text style={{ fontWeight: 'bold'}}>Address </Text>
              <Text>{this.state.address}</Text>
              <Text>{'\n'}</Text>
              <Text style={{ fontWeight: 'bold'}}>Email </Text>
              <Text>{this.state.email}</Text>
            </Text>
          </View>
        </View>
      )
    }
  }

  render() {

    return (
      <Container>
        <View style={styles.headerWrapper}>
        <AndroidBackButton onPress={() => this.onHardwareBack()} />
        <LifekeyHeader
          backgroundColor={this.state.colour}
          foregroundHighlightColor={this.state.foregroundColor}
          icons={[
            {
              icon: <BackIcon width={16} height={16} stroke="#000" />,
              onPress: () => this.onBackIconPress()
            },
            {
              icon: <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={{ uri: this.state.image_uri }}
                        style={{ width: 36, height: 36, borderRadius: 45 }}
                      />
                      <Text style={{ color: "#000", marginLeft: 8 }}>{this.state.display_name}</Text>
                    </View>,
              onPress: () => this.setState({ activeTab: ACTIVITY })
            },
            {
              icon: <InfoIcon width={24} height={24} stroke="#000" />,
              onPress: () => this.setState({ activeTab: HELP })
            }
          ]}
          tabs={[
            {
              text: 'Connect',
              onPress: () => this.setState({ activeTab: CONNECT }),
              active: this.state.activeTab === CONNECT
            },
            {
              text: 'Activity',
              onPress: () => this.setState({ activeTab: ACTIVITY }),
              active: this.state.activeTab === ACTIVITY
            },
            {
              text: 'Shared',
              onPress: () => this.setState({ activeTab: SHARED }),
              active: this.state.activeTab === SHARED
            }
          ]}
        />
        </View>
        <Content style={styles.content}>
          {this.renderTab()}
        </Content>
      </Container>
    )
  }
}

const styles = {
  headerWrapper: {
    borderColor: Palette.consentGrayDark,
    height: Design.lifekeyHeaderHeight
  },
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
  qrCodeWrap: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  connectHelpTextWrap: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 50,
    marginRight: 50
  },
  connectFooterWrap: {
    flex: 2,
    flexDirection: 'row'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default ConnectionDetails
