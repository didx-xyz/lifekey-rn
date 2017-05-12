import React from "react"
import Scene from "../Scene"
import Palette from "../Palette"
import Touchable from "../Components/Touchable"
import AndroidBackButton from 'react-native-android-back-button'
import BackIcon from "../Components/BackIcon"
import InfoIcon from "../Components/InfoIcon"
import HelpIcon from "../Components/HelpIcon"
import LocationIcon from "../Components/LocationIcon"
import MarketingIcon from "../Components/MarketingIcon"
import PeriodIcon from "../Components/PeriodIcon"
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
  Image,
  ToastAndroid
} from "react-native"

import {
  Container,
  Content
} from "native-base"
import ISACard from '../Components/ISACard'
import Icon from 'react-native-vector-icons/Ionicons'
import HexagonIcon from '../Components/HexagonIcon'
import Routes from '../Routes'

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
      tel: null,
      email: null,
      actions: [],
      enabled_isas: [],
      display_name: this.props.route.display_name,
      current_user_display_name: Session.getState().user.display_name,
      connection_id: this.props.route.id, // id of the connection request
      user_did: this.props.route.user_did // did of the user connected to
    }
  }

  async loadActions(actions_url) {
    if (actions_url) {
      Logger.info('Fetching actions')
      const requestOptions = {
        "method": "GET",
        "headers": {
          "x-cnsnt-did": Session.getState().user.did
        }
      }
      Logger.networkRequest('GET', actions_url, requestOptions)
      const actionsResponse = await fetch(actions_url, requestOptions)
      Logger.networkResponse(actionsResponse.status, new Date(), JSON.stringify(actionsResponse))
      const actions = JSON.parse(actionsResponse._bodyText)
      if (actions) {
        if (actions.body) {
          this.setState({
            actions: actions.body
          }, () => Logger.info('Actions updated'))
        } else {
          this.setState({
            actions: actions
          }, () => Logger.info('Actions updated'))
        }
      } else {
        Logger.warn('Could not parse JSON')
      }
    }
  }

  async loadISAs() {
    const response = await Api.allISAs()
    const enabled_isa_ids = response.body.enabled
    const requests = enabled_isa_ids.map(id => Api.getISA({ id }))
    const responses = await Promise.all(requests)
    const enabled_isas = responses.map(x => x.body)

    this.setState({
      enabled_isas: enabled_isas
    }, () => Logger.info(JSON.stringify(this.state)))
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
        tel: response.body.user.tel,
        email: response.body.user.email
      })
    } catch (error) {
      Logger.warn(error)
    }

  }

  async callAction(action) {
    this.navigator.push({
      ...Routes.informationRequest,
      display_name: this.state.display_name,
      colour: this.state.colour,
      image_uri: this.state.image_uri,
      actions_url: this.state.actions_url,
      address: this.state.address,
      tel: this.state.tel,
      email: this.state.email,
      action: action,
      actions: this.state.actions,
      did: this.state.user_did
    })
    // try {
    //   const myDid = Session.getState().user.did
    //   const requestOptions = {
    //     "method": "GET",
    //     "headers": {
    //       "x-cnsnt-did": myDid
    //     }
    //   }
    //   Logger.networkRequest('GET', actionURL, requestOptions)
    //   const response = await fetch(actionURL, requestOptions)
    //   if (response) {
    //     ToastAndroid.show('ISA requested', ToastAndroid.SHORT)
    //     Logger.networkResponse(response.status, new Date(), JSON.stringify(response))
    //   }
    // } catch (error) {
    //   Logger.warn(error)
    // }

  }

  componentWillMount() {
    super.componentWillMount()
    this.loadData()
    // this.loadISAs()// do it on tab change to SHARED
  }

  componentWillFocus() {
    super.componentWillFocus()
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

  parseISA(isar) {
    let entities = null
    if(isar.entities) {
      entities = isar.entities
    } else {
      entities = isar.required_entities
    }
    return JSON.parse(entities)
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
                Invite other people to connect with {this.state.display_name} by sharing this unique code.
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
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="ios-arrow-round-up" size={30} color="#000"/>
                    <Text style={{ fontSize: 18, color: 'black', marginRight: 20 }}> Share</Text>
                  </View>
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
              Hi {this.state.current_user_display_name}. Thank you for connecting with {this.state.display_name}. Please select an action from the options below to continue.
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
                <Touchable key={i} onPress={() => this.callAction(action)}>
                  <View style={styles.actionItem}>
                    <HexagonIcon width={65} height={65} fill={Palette.consentGrayDarkest}/>
                    <Text style={styles.actionItemText}>{action.name}</Text>
                  </View>
                </Touchable>
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
          { this.state.enabled_isas.map((x, i) =>
            <ISACard
              key={i}
              title={x.information_sharing_agreement_request.purpose}
              shared={this.parseISA(x.information_sharing_agreement_request).map(y => y.name)}
              terms={[
                { icon: <PeriodIcon width={15} height={15}/>, text: "12 Months" },
                { icon: <LocationIcon width={15} height={15}/>, text: "In SA" },
                { icon: <MarketingIcon width={15} height={15}/>, text: "Marketing" }
              ]}
              date="23-02-2017"
              expires="23-02-2018"
            />

          )}

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
              <Text>{'\n'}</Text>
              <Text style={{ fontWeight: 'bold'}}>Tel </Text>
              <Text>{this.state.tel}</Text>
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
                      <Text style={{ fontSize: 18, color: "#000", marginLeft: 8 }}>{this.state.display_name}</Text>
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
              onPress: () => {
                this.setState({ activeTab: SHARED })
                this.loadISAs()
              },
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
    flex: 1,
    // width: "28%",
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center'
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
