
import React from 'react'
import ActivityIndicator from 'ActivityIndicator'
import AndroidBackButton from 'react-native-android-back-button'
import PropTypes from "prop-types"
import _ from 'lodash'

import {
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity
} from 'react-native'

import {Container, Content} from 'native-base'

import ISACard from '../Components/ISACard'
import Icon from 'react-native-vector-icons/Ionicons'
import HexagonIcon from '../Components/HexagonIcon'
import Routes from '../Routes'
import BackIcon from '../Components/BackIcon'
import InfoIcon from '../Components/InfoIcon'
import HelpIcon from '../Components/HelpIcon'
import LocationFlagIcon from '../Components/LocationFlagIcon'
import MarketingIcon from '../Components/MarketingIcon'
import PeriodIcon from '../Components/PeriodIcon'
import Api from '../Api'
import ConsentDiscoveredUser from '../Models/ConsentDiscoveredUser'
import ConsentUser from '../Models/ConsentUser'
import ConsentUserConnectionMessage from '../Models/ConsentUserConnectionMessage'
import Logger from '../Logger'
import Session from '../Session'
import LifekeyHeader from '../Components/LifekeyHeader'
import LifekeyFooter from '../Components/LifekeyFooter'
import ProgressIndicator from "../Components/ProgressIndicator"
import Design from '../DesignParameters'
import Config from '../Config'
import Scene from '../Scene'
import Palette from '../Palette'
import Touchable from '../Components/Touchable'

import InformationRequest from '../Components/SceneComponents/InformationRequest'
import Connect from "../Components/SceneComponents/Connect"

const CONNECT = 0
const ACTIVITY = 1
const SHARED = 2
const HELP = 3

class ConnectionDetails extends Scene {

  constructor(props) {
    super(props);
    this.state = {
      first_load: true,
      activeTab: ACTIVITY,
      showHelp: false,
      colour: "white",
      foregroundColor: 'white',
      image_uri: this.props.route.image_uri,
      actions_url: null,
      address: null,
      tel: null,
      email: null,
      actions: [],
      enabled_isas: [],
      display_name: this.props.route.display_name,
      current_user_display_name: Session.getState().user.display_name,
      // connection_id: this.props.route.id, // id of the connection request
      user_did: this.props.route.user_did, // did of the user connected to
      messages: [],
      modalVisible: false
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
      
      let text = await actionsResponse.text()
      const actions = JSON.parse(text)
      return Promise.resolve(actions.body || actions || [])
    }
    return Promise.resolve([])
  }

  // These performance hits come in steps 2 and 5. 

  async loadISAs() {
    var start1 = new Date().getTime()                                             // PERFORMANCE

    // const response = await Api.allISAs()
    const response = await Api.ISAlist(this.state.user_did)

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

  async loadData() {
    Promise.all([
      Api.profile({did: this.state.user_did}),
      ConsentUserConnectionMessage.from(this.state.user_did),
    ]).then(res => {
      var [profile, messages] = res
      const { body: { user: { colour = '', image_uri = '', did } } } = profile;
      const agentColors = colour.split(',');
      this.setState({
        connectionProfile: profile.body.user,
        colour: agentColors[0],
        colourSecondary: (agentColors[1]) ? agentColors[1] : '#000',
        image_uri: image_uri,
        actions_url: profile.body.user.actions_url,
        address: profile.body.user.address,
        tel: profile.body.user.tel,
        email: profile.body.user.email,
        messages: messages
      })
      return Promise.resolve(profile.body.user.actions_url)
    }).then(actions_url => {
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
    
    // this.setState({ action: action, required_entities: action.entities },() => {
    //   this.setModalVisible(true)  
    // })

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


  editIsa(){
    this.navigator
  }

  componentDidMount() {
    super.componentDidMount()
    this.props.firebaseInternalEventEmitter.addListener('user_message_received', this.loadData.bind(this))                                                  
    this.setState({loading_cxn_details: true })
    this.loadData()
  }

  componentWillFocus() {

    // console.log("PROPS ROUTE: ", this.props.route)

    super.componentWillFocus()
    if (this.state.first_load) return
    //Is modal inforequest visible? 
    const modalValue = this.context.getModalVisible() 
    this.setState({loading_cxn_details: true, modalVisible: modalValue })
    this.loadData()
  }

  // onHelpPress() {
  //   this.setState({
  //     showHelp: !this.state.showHelp
  //   })
  // }

  goBack() {
    if (this.state.showHelp){
      this.setState({
        showHelp: false
      })
    } else {
      this.navigator.resetTo({...Routes.main})
    }
  }

  setModalVisible(value) {
    // Set modal visible in context 
    this.context.onSetModalVisible(value)
    this.setState({ modalVisible: value });
  }

  onBackIconPress() {
    this.goBack()
  }

  onHardwareBack() {
    this.goBack()
    return true
  }

  parseEntities(isar) {
    var entitiesJSON = isar.entities || isar.required_entities
    const entities = JSON.parse(entitiesJSON)
    Logger.info('entitiesJSON', entities)
    return entities
  }

  async respondToActionableMessage(message_id, user_response) { // message_id => claim_id // response => boolean
    // submit claim to lifekey-server
    try {
      const response = await Api.claimReponseFromUserConnection({ message_id, accepted: user_response });
      await ConsentUserConnectionMessage.update(message_id, true, user_response);
      this.loadData();
    } catch (error) {
      Logger.warn(error);
    }
  }

  renderConnectionMessages() {
    return (
      // sort message date descending
      _.sortBy(this.state.messages, (message) => -new Date(message.timestamp)).map((msg, idx) => {
        const { message_type = '', message_title = '', message_id = idx, claim_actioned = false, claim_accepted = false } = msg;
        if (message_type === 'actionable_message') {
          return (
            <View key={message_id}>
              <View style={styles.messageActionableContainer}>
                <View style={styles.messageActionableMessage}>
                  <Text style={{ fontWeight: "500", paddingBottom: 10 }}>{message_title}</Text>
                  <Text>{msg.message_text}</Text>
                </View>
                {(claim_actioned) ? 
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: (claim_accepted ? 'flex-end' : 'flex-start' ) }]}>
                  {(claim_accepted) ?
                    <View style={styles.messageUserResponsedContainerAccepted}><Text style={[styles.actionTitleText, { color: Palette.consentWhite }]}>Accepted</Text></View>
                    :
                    <View style={styles.messageUserResponsedContainerRejected}><Text style={[styles.actionTitleText, { color: Palette.consentWhite }]}>Rejected</Text></View>
                  }
                </View>
                : 
                <View style={[styles.messageActionableButtons]}>
                  <TouchableOpacity onPress={() => this.respondToActionableMessage(message_id, false)} style={[styles.rejectButton, { borderColor: this.state.colour }]}><Text style={[styles.messageActionableButtonsText, { color: "#000" }]}>Reject</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => this.respondToActionableMessage(message_id, true)} style={[styles.acceptButton, { backgroundColor: this.state.colour }]}><Text style={[styles.messageActionableButtonsText]}>Accept</Text></TouchableOpacity>
                </View>
                }
              </View>
              <Text style={styles.messageTime}>
                {new Date(msg.timestamp).toDateString()}
              </Text>
            </View>
          )
        }
        return (
          <View key={idx}>
            <View style={styles.message}>
              <Text style={styles.messageText}>
                {msg.message_text}
              </Text>
            </View>
            <Text style={styles.messageTime}>
              {new Date(msg.timestamp).toDateString()}
            </Text>
          </View>
        )
      })
    );
  }

  _renderISACard(ISA, index) {
    let entities
    let re = ISA.information_sharing_agreement_request.required_entities
    if (typeof re === 'string') {
      re = re.replace("\\\"[", '[')
      re = re.replace(/]\\"/g, "]")
      re = re.replace(/\\\\\\"/g,'\\"')
      re = re.replace(/\\"/g,'"')
      entities = JSON.parse(re)
    } else {
      entities = re
    }
    let shared = entities.map(y => y.name)
    let date = new Date(ISA.information_sharing_agreement_request.created_at).toDateString()
    let expires = new Date(ISA.information_sharing_agreement_request.expires_at).toDateString()
    let hash = ISA.information_sharing_agreement.transaction_hash
    hash = hash?hash:""
    return (
      <ISACard
        colour={this.state.colour}
        key={index}
        title={ISA.information_sharing_agreement_request.purpose}
        shared={shared}
        terms={[
          { icon: <PeriodIcon width={15} height={15}/>, text: "12 Months" },
          { icon: <LocationFlagIcon width={15} height={15}/>, text: "In SA" },
          { icon: <MarketingIcon width={15} height={15}/>, text: "Marketing" }
        ]}
        date={date}
        expires={expires}
        transactionHash={hash}
      />
    )

  }

  renderISA() {
    return (
      <View style={{ flex: 1 , paddingLeft: Design.paddingLeft, paddingRight: Design.paddingRight }}>
        <Text style={_.assign({}, styles.actionTitleText, { color: "#888", padding: 20 })}>
          Your shared the following personal data
          <Text style={{ fontWeight: 'bold' }}>
            {' ' + this.state.display_name}
          </Text>
        </Text>
        { this.state.enabled_isas.map((x, i) => {return this._renderISACard(x, i)}
        )}

      </View>
    )
  }

  renderTab() {
     switch (this.state.activeTab) {
      case CONNECT: 
        return <Connect profile={this.state.connectionProfile} connectWithMe={false}/>

      case ACTIVITY:
        return (
          <ScrollView style={styles.messages}>
            { /* <View style={styles.message}>
              <Text style={styles.messageText}>
                Hi {this.state.current_user_display_name}. Thank you for connecting with {this.state.display_name}. Please select an action from the options below to continue.
              </Text>
              <Text style={styles.messageTime}>
                2 mins
              </Text>
            </View> */}
            <View style={styles.actions}>
              <View style={[styles.actionTitle, { borderColor: Palette.consentGrayLight }]}>
                <Text style={[styles.actionTitleText, { fontSize: 17 }]}>ACTIONS</Text>
              </View>
              <View style={styles.actionList}>
                {this.state.actions.map((action, i) => {
                  console.log(this.state.actions);
                  if (action.active || action.active === undefined) {
                    return (
                      <Touchable key={i} onPress={() => this.callAction(action.name, action)}>
                        <View style={styles.actionItem}>
                          {/* <Image style={{"width" : 30, "height": 30, position: 'absolute', right: 20, top: 60, zIndex: 100 }} source={require('../../App/Images/tick.png')} /> */}
                          <Image source={{uri: (action.image_uri) ? action.image_uri : this.state.image_uri.replace('\{type\}', 'icon')}} style = {{width: 73, height: 80}} />
                          <Text style={[styles.actionItemText, { color: Palette.consentOffBlack }]}>{action.name}</Text>
                        </View>
                      </Touchable>
                    );
                  }
                  return (
                    <View key={i} style={[styles.actionItem]}>
                    <Image source={{uri: (action.image_uri) ? action.image_uri : this.state.image_uri.replace('\{type\}', 'icon')}} style = {{ top: 15, width: 73, height: 80, position: 'absolute' }} />
                      <HexagonIcon fillOpacity={0.8} width={80} height={80} fill={Palette.consentGrayMedium} />
                      <Text style={[styles.actionItemText, { color: Palette.consentGrayMedium }]}>{action.name}</Text>
                    </View>
                  );
                }
                  
                )}
              </View>
            </View>

            {/* Connection messages from the brand go here */}
            {this.renderConnectionMessages()}

          </ScrollView>
        )
      case SHARED:
        return this.renderISA()
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
    const imageURL = (this.state.image_uri) ? this.state.image_uri.replace('\{type\}', 'logo') : '';
    
    return ( 
        <Container>
          <View style={styles.headerWrapper}>
            <AndroidBackButton onPress={() => this.onHardwareBack()} />
            <LifekeyHeader
              hasGradient={true}
              backgroundColor={this.state.colour}
              backgroundColorSecondary={this.state.colourSecondary}
              foregroundHighlightColor={Palette.consentWhite}
              icons={[
                {
                  icon: (<BackIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke="#fff" />),
                  onPress: this.navigator.pop,
                  borderColor: this.state.colour
                },
                {
                  logo: true,
                  icon: (
                    <View>
                      {/* <Image source={{uri: this.state.image_uri}} style={styles.fullWidthHeight} /> */}
                      <Image source={{ uri: imageURL }} style={{ width: 180, height: 40 }} />
                    </View>
                  ),
                  onPress: () => this.setState({activeTab: ACTIVITY}),
                  borderColor: this.state.colour
                },
                {
                  icon: <View width={24} height={24}/>,
                  onPress: () => {},
                  borderColor: this.state.colour
                }
                // {
                //   icon: <InfoIcon width={24} height={24} stroke="#000" />,
                //   onPress: () => this.setState({activeTab: HELP}),
                //   borderColor: this.state.colour
                // }
              ]}
              tabs={[
                {
                  text: 'ReferQi',
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
        { 
          this.state.loading_cxn_details ? 
            <ProgressIndicator progressCopy={ this.state.progressCopy }/>
          :
            <Content style={styles.content}>
              <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}
                >
               <View style={{ "flex": 1 }}>
                  <View style={ styles.modalBackdrop }/>
                  
                  <InformationRequest
                    display_name={this.state.display_name}
                    colour={ this.state.colour }
                    image_uri={ this.state.image_uri }
                    actions_url={ this.state.actions_url }
                    address={ this.state.address }
                    tel={ this.state.tel }
                    email={ this.state.email }
                    did={ this.state.user_did }
                    action={ this.state.action }
                    required_entities={ this.state.required_entities }
                    onCancel={this.setModalVisible.bind(this)} 
                  />

               </View>
              </Modal>
              {this.renderTab()}
            </Content>
        }
        </Container>
      )
  }
}

ConnectionDetails.contextTypes = {
  // behavior
  "onSetModalVisible": PropTypes.func,

  // state
  "getModalVisible": PropTypes.func,
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
  fullWidthHeight: {
    width: 40,
   height: 40,
  //  backgroundColor: Palette.consentWhite,
  },
  headerWrapper: {
    borderColor: Palette.consentGrayDark,
    height: Design.lifekeyHeaderHeight
  },
  content: {
    backgroundColor: Palette.consentGrayLight
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
    backgroundColor: Palette.consentWhite,
    marginHorizontal: 20,
    padding: 20,
    // borderRadius: 5,
    width: "80%"
  },
  messageActionableContainer: {
    backgroundColor: Palette.consentOffWhite,
    marginHorizontal: 20,
    // borderRadius: 5,
    width: "90%"
  },
  messageActionableMessage: {
    padding: 20,
  },
  messageActionableButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 20,
    // borderBottomLeftRadius: 5,
    // borderBottomRightRadius: 5 
  },
  messageActionableButtonsText: {
    padding: 20,
    color: Palette.consentWhite,
    fontWeight: "500",
    alignSelf: "center"
  },
  messageText: {
    color: '#000',
    paddingRight: 15,
    fontSize: 14,
    fontWeight: "500"
  },
  messageUserResponsedContainerAccepted: {
    flex: 0.4,
    justifyContent: 'flex-end',
    paddingVertical: 10,
    backgroundColor: 'green'
  },
  messageUserResponsedContainerRejected: {
    flex: 0.4,
    justifyContent: 'flex-start',
    paddingVertical: 10,
    backgroundColor: 'red'
  },
  messageTime: {
    color: Palette.consentGray,
    alignSelf: "flex-end",
    fontSize: 14,
    padding: 12,
    marginRight: 10,
  },
  actions: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    padding: 10,
    // borderRadius: 5,
    backgroundColor: Palette.consentWhite
  },
  actionTitle: {
    backgroundColor: Palette.consentWhite,
    padding: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1
  },
  actionTitleText: {
    textAlign: "center",
    color: Palette.consentOffBlack,
    fontWeight: "500"
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
    fontSize: 15,
    fontWeight: "500",
    paddingTop: Design.paddingTop / 2
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
  },
  "modalBackdrop":{
    "position": "absolute",
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0,
    "zIndex": 0,
    "opacity": 0.9,
    "backgroundColor": Palette.consentOffBlack
  },
  rejectButton: {
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    margin: 10
  },
  acceptButton: {
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    margin: 10
  },

}

export default ConnectionDetails

