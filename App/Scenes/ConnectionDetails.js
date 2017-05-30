
import React from "react"
import Scene from "../Scene"
import Palette from "../Palette"
import ActivityIndicator from "ActivityIndicator"
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
import ConsentUser from '../Models/ConsentUser'
import ConsentMessage from '../Models/ConsentMessage'
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
      first_load: true,
      activeTab: ACTIVITY,
      showHelp: false,
      colour: "white",
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
      user_did: this.props.route.user_did, // did of the user connected to
      messages: []
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
      return Promise.resolve(actions.body || actions || [])
    }
    return Promise.resolve([])
  }

  // These performance hits come in steps 2 and 5. 

  async loadISAs() {
    var start1 = new Date().getTime()                                             // PERFORMANCE

    const response = await Api.allISAs()

    var start2 = new Date().getTime()                                             // PERFORMANCE. Call to response 11304 milliseconds.
    console.log("2 - Call to response " + (start2 - start1) + " milliseconds.")   // PERFORMANCE

    const enabled_isa_ids = response.body.enabled

    var start3 = new Date().getTime()                                             // PERFORMANCE
    console.log("3 - Call to response " + (start3 - start2) + " milliseconds.")   // PERFORMANCE

    const requests = enabled_isa_ids.map(id => Api.getISA({ id }))

    var start4 = new Date().getTime()                                             // PERFORMANCE
    console.log("4 - Call to response " + (start4 - start3) + " milliseconds.")   // PERFORMANCE

    const responses = await Promise.all(requests)

    var start5 = new Date().getTime()                                             // PERFORMANCE.  Call to response 10080 milliseconds.
    console.log("5 - Call to response " + (start5 - start4) + " milliseconds.")   // PERFORMANCE

    const enabled_isas = responses.map(x => {
      // Parse the nested JSON
      x.body.information_sharing_agreement_request.required_entities =
      this.parseEntities(x.body.information_sharing_agreement_request)
      return x.body
    })

    var start6 = new Date().getTime()                                             // PERFORMANCE
    console.log("6 - Call to response " + (start6 - start5) + " milliseconds.")   // PERFORMANCE

    this.setState({
      enabled_isas: enabled_isas
    }, () => Logger.info(JSON.stringify(this.state)))
  }

  loadData() {
    var actions_url
    Promise.all([
      Api.profile({did: this.state.user_did}),
      ConsentMessage.from(this.state.user_did)
    ]).then(res => {
      var [profile, messages] = res
      actions_url = profile.body.user.actions_url
      this.setState({
        colour: profile.body.user.colour,
        image_uri: profile.body.user.image_uri,
        actions_url: actions_url,
        address: profile.body.user.address,
        tel: profile.body.user.tel,
        email: profile.body.user.email,
        messages: messages
      })
      return Promise.resolve()
    }).then(_ => {
      return this.loadActions(actions_url)
    }).then(axns => {
      this.setState({
        actions: axns,
        loading_cxn_details: false,
        first_load: false
      })
    }).catch(err => {
      alert('Unable to load connection data')
      this.navigator.pop()
    })
  }

  async callAction(name, action) {

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
      required_entities: action.entities,
      did: this.state.user_did
    })
  }

  componentDidMount() {
    super.componentDidMount()
    this.setState({loading_cxn_details: true})
    this.loadData()
  }

  componentWillFocus() {
    super.componentWillFocus()
    if (this.state.first_load) return
    this.setState({loading_cxn_details: true})
    this.loadData()
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

  parseEntities(isar) {
    let entitiesJSON = null
    if(isar.entities) {
      entitiesJSON = isar.entities
    } else {
      entitiesJSON = isar.required_entities
    }
    const entities = JSON.parse(entitiesJSON)
    Logger.info('entitiesJSON', entities)
    return entities
  }

  renderConnectionMessages() {
    return this.state.messages.map(msg => {
      return (
        <View key={msg.key} style={styles.message}>
          <Text style={styles.messageText}>
            {msg.message_text}
          </Text>
          <Text style={styles.messageTime}>
            {new Date(msg.timestamp).toDateString()}
          </Text>
        </View>
      )
    })
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
                <Touchable key={i} onPress={() => this.callAction(action.name, action)}>
                  <View style={styles.actionItem}>
                    <HexagonIcon width={65} height={65} fill={Palette.consentGrayDarkest}/>
                    <Text style={styles.actionItemText}>{action.name}</Text>
                  </View>
                </Touchable>
              )}
            </View>
          </View>
          {this.renderConnectionMessages()}
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
              shared={JSON.parse(x.information_sharing_agreement_request.required_entities).map(y => y.name)}
              terms={[
                { icon: <PeriodIcon width={15} height={15}/>, text: "12 Months" },
                { icon: <LocationIcon width={15} height={15}/>, text: "In SA" },
                { icon: <MarketingIcon width={15} height={15}/>, text: "Marketing" }
              ]}
              date="23-02-2017"
              expires="23-02-2018"
              transactionHash={x.information_sharing_agreement.transaction_hash}
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
      this.state.loading_cxn_details ? (
        <Container>
          <View style={styles.progressContainer}>
            <ActivityIndicator color={Palette.consentGrayDark} style={styles.progressIndicator}/> 
            <Text style={styles.progressText}>Loading Connection Details...</Text>
          </View>
        </Container>
      ) : (
        <Container>
        <View style={styles.headerWrapper}>
          <AndroidBackButton onPress={() => this.onHardwareBack()} />
          <LifekeyHeader
            backgroundColor={this.state.colour}
            foregroundHighlightColor={this.state.foregroundColor}
            icons={[
              {
                icon: (<BackIcon width={16} height={16} stroke="#000" />),
                onPress: this.navigator.pop,
                borderColor: this.state.colour
              },
              {
                icon: (
                  <View style={styles.centredRow}>
                    <Image source={{uri: this.state.image_uri}}
                          style={styles.fullWidthHeight} />
                  </View>
                ),
                onPress: () => this.setState({activeTab: ACTIVITY}),
                borderColor: this.state.colour
              },
              {
                icon: <InfoIcon width={24} height={24} stroke="#000" />,
                onPress: () => this.setState({activeTab: HELP}),
                borderColor: this.state.colour
              }
            ]}
            tabs={[
              {
                text: 'Connect',
                onPress: () => this.setState({activeTab: CONNECT}),
                active: this.state.activeTab === CONNECT
              },
              {
                text: 'Activity',
                onPress: () => this.setState({activeTab: ACTIVITY}),
                active: this.state.activeTab === ACTIVITY
              },
              {
                text: 'Shared',
                onPress: () => this.setState({activeTab: SHARED}, this.loadISAs.bind(this)),
                active: this.state.activeTab === SHARED
              }
            ]} />
        </View>
        <Content style={styles.content}>
          {this.renderTab()}
        </Content>
        </Container>
      )
    )
  }
}

const styles = {
  "progressContainer": {
    // "backgroundColor": Palette.consentBlue,
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "progressIndicator": {
    "width": 75,
    "height": 75 
  },
  "progressText":{
    "color": Palette.consentGrayDark
  },
  centredRow: {flexDirection: 'row', alignItems: 'center'},
  fullWidthHeight: {width: "100%", height: "100%"},
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
