
import React, { Component } from 'react'
import { InteractionManager, ToastAndroid } from 'react-native'
import PropTypes from "prop-types"
import ActivityIndicator from "ActivityIndicator"
import AppLogo from '../Images/logo_big.png'
import Scene from '../Scene'
import Design from '../DesignParameters'
import Palette from '../Palette'
import Api from '../Api'
import Config from '../Config'
import Routes from '../Routes'
import LifekeyHeader from '../Components/LifekeyHeader'
import LifekeyFooter from '../Components/LifekeyFooter'
import LifekeyList from '../Components/LifekeyList'
import AndroidBackButton from 'react-native-android-back-button'
import ConsentUser from '../Models/ConsentUser'
import ThanksIcon from '../Components/ThanksIcon'
import ScanIcon from '../Components/ScanIcon'
import MessagesIcon from '../Components/MessagesIcon'
import ProgressIndicator from "../Components/ProgressIndicator"
import Toast from '../Utils/Toast'

import {
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  Image,
  StatusBar
} from 'react-native'
import {
  Container,
  Col,
  Footer,
  ListItem,
  Content,
} from 'native-base'

const TAB_CONNECTED = 0
const TAB_SUGGESTED = 1
const TAB_PEERREQUESTS = 2

class Main extends Scene {

  constructor(props) {
    super(props)
    this.first_load = true
    this.is_mounted = false
    this.cxn_unread_msgs = {}
    
    this.state = {
      activeTab: TAB_CONNECTED,
      searchText: '',
      peerConnections: [],
      botConnections: [],
      pendingPeerConnections: [],
      pendingBotConnections: [],
      profiles: [],
      progressCopy: 'Loading...',
      asyncActionInProgress: true
    }

    this.onBoundPressProfile = this.onPressProfile.bind(this)
    this.onBoundGoToBotConnectionDetails = this.goToBotConnectionDetails.bind(this)
    this.onBoundGoToBotConnect = this.goToBotConnect.bind(this)
    this.onBoundGoToPeerConnectionDetails = this.goToPeerConnectionDetails.bind(this)
    this.onBoundGoToPeerConnect = this.goToPeerConnect.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()
    this.props.firebaseInternalEventEmitter.addListener('user_message_received', this.set_unread.bind(this))
    this.props.firebaseInternalEventEmitter.addListener('user_connection_request', this.setNewConnectionRequest.bind(this))
    this.props.firebaseInternalEventEmitter.addListener('user_connection_created', this.setNewConnection.bind(this))
    this.props.firebaseInternalEventEmitter.addListener('user_connection_deleted', this.deleteExistingPeerConnection.bind(this))
    this.is_mounted = true
    this.interaction = InteractionManager.runAfterInteractions(() => {
      Promise.all([
        this.loadConnections(),
        this.loadProfile(),
        this.refreshThanksBalance()
      ])
      .then(response => this.setState({"asyncActionInProgress": false}))
      .catch(console.log.bind(console, 'error in component_did_mount'))
    })
  }

  componentWillUnmount() {
    this.props.firebaseInternalEventEmitter.removeListener('user_message_received', this.set_unread.bind(this))
    this.props.firebaseInternalEventEmitter.removeListener('user_connection_request', this.setNewConnectionRequest.bind(this))
    this.props.firebaseInternalEventEmitter.removeListener('user_connection_created', this.setNewConnection.bind(this))
    this.props.firebaseInternalEventEmitter.removeListener('user_connection_deleted', this.deleteExistingPeerConnection.bind(this))
    this.is_mounted = false
    if (this.interaction) this.interaction.cancel()
  }
  
  componentDidFocus() {
    if (this.first_load) {
      this.first_load = false
      return
    }
    super.componentDidFocus()
    this.loadConnections()
    this.loadProfile()
    this.refreshThanksBalance()
  }

  setNewConnectionRequest(from){
    this.loadConnections()
    Toast.show(`${from} just requested that you connect...`, ToastAndroid.SHORT)
  }
  setNewConnection(from){
    this.loadConnections()
    Toast.show(`You and ${from} are now connected...`, ToastAndroid.SHORT)
  }
  deleteExistingPeerConnection(){
    this.loadConnections()
    Toast.show(`Connection deleted...`, ToastAndroid.SHORT)
  }

  set_unread(from) {
    this.cxn_unread_msgs[from] = true
  }

  cxn_has_unread(cxn) {
    return this.cxn_unread_msgs[cxn.did]
  }

  remove_cxn_from_unread_backlog(cxn) {
    delete this.cxn_unread_msgs[cxn.did]
  }

  loadProfile() {
    if (!this.is_mounted || this.state.userName) return
    return Api.getMyData().then(userData => {
      this.setState({
        userName: userData.resourcesByType.find(
          rt => rt.name === 'Person'
        ).items[0].firstName
      }, function() {
        console.log('Profile was loaded')
      })
    }).catch(err => {
      console.log('get my data error', err)
      this.setState({userName: 'error'})
    })
  }

  refreshThanksBalance() {
    if (!this.is_mounted) return
    return ConsentUser.refreshThanksBalance().then(balance => {
      this.setState({
        thanksBalanceAmount: balance
      }, function() {
        console.log('refreshThanksBalance')
      })
    }).catch(err => {
      console.log('thanks balance', err)
      this.setState({
        thanksBalanceAmount: '0'
      }, function() {
        console.log('refreshThanksBalance error')
      })
    })
  }

  loadConnections(callback, cacheFor, skipCache) {
    if (!this.is_mounted) {
      (callback || function() {})()
      return
    }
    return Api.getMyConnections().then(connections => {

      console.log('======================================', connections)

      this.setState({
        "peerConnections": connections.peerConnections,
        "botConnections": connections.botConnections,
        "pendingPeerConnections": connections.pendingPeerConnections,
        "pendingBotConnections": connections.pendingBotConnections,
        activeBots: connections.activeBots
      })

    })
    .catch(error => {
      console.log("ERROR LOADING CONNECTIONS: ", JSON.stringify(error))
    })
  }

  setTab(tab) {
    if (!this.is_mounted) return
    this.setState({activeTab: tab})
  }

  updateSearch(text) {
    if (!this.is_mounted) return
    this.setState({searchText: text}, function() {
      console.log('updateSearch')
    })
  }

  clearSearch() {
    if (!this.is_mounted) return
    this.setState({searchText: ''}, function() {
      console.log('clearSearch')
    })
  }

  _hardwareBack() {
    // Quit
    return true // was false, changed it to avoid app closing. 
  }

  /* PEER ROUTES */

  goToPeerConnect(connection) {

    console.log("CONNECTION PEER REQUEST OBJECT: ", connection)

    this.navigator.push({
      ...Routes.connectionPeerToPeer,
      did: connection.did,
      display_name: connection.display_name,
      image_uri: connection.image_uri,
      user_connection_request_id: connection.user_connection_request_id
    })
  }

  goToPeerConnectionDetails(connection) {

    this.navigator.push({
      ...Routes.connectionDetailsPeerToPeer,
      isa_did: connection.isa_id,
      connection_did: connection.did,
      user_connection_id: connection.user_connection_id,
      id: connection.id,
      display_name: connection.display_name,
      image_uri: connection.image_uri
    })
  }

  /* BOT ROUTES */

  goToBotConnect(connection) {
    this.navigator.push({
      ...Routes.connection,
      did: connection.did,
      display_name: connection.display_name,
      image_uri: connection.image_uri,
      actions_url: connection.actions_url
    })
  }

  goToBotConnectionDetails(connection) {
    if (this.cxn_has_unread(connection)) {
      console.log('cxn has unread')
      this.remove_cxn_from_unread_backlog(connection)
    }
    this.navigator.push({
      ...Routes.connectionDetails,
      user_did: connection.did,
      id: connection.id,
      display_name: connection.display_name,
      image_uri: connection.image_uri
    })
  }

  onPressProfile() {
    this.context.onEditResource("http://schema.cnsnt.io/public_profile_form", null, "Public Profile")
    this.navigator.push({ ...Routes.editProfile })
  }

  render() {

    var icons= [
      {
        icon: (<MessagesIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Design.headerIconColour} />),
        onPress: () => this.navigator.push(Routes.messages), //onPress: () => this.navigator.push({...Routes.messages, direction: 'leftToRight'}),
        borderColor: "white"
      },
      {
        icon: <Image style={{height: "100%", width: "100%"}} source={AppLogo}/>,
        onPress: () => alert('test'),
        onLongPress: () => {
          if (Config.DEBUG) {
            this.navigator.push(Routes.debug.main)
          }
        },
        borderColor: "white"
      },
      {
        icon: (<ThanksIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Design.headerIconColour} />),
        onPress: () => this.navigator.push(Routes.thanks),
        borderColor: "white",
        secondaryItem: this.state.thanksBalanceAmount ? <Text>{this.state.thanksBalanceAmount}</Text> : (<ActivityIndicator width={Design.headerIconWidth / 1.5} height={Design.headerIconHeight / 1.5} color={Palette.consentGrayDark} />)
      }
    ], tabs=[
      {
        text: 'Connected',
        onPress: () => this.setTab(TAB_CONNECTED),
        active: this.state.activeTab === 0
      },
      {
        text: 'Suggested',
        onPress: () => this.setTab(TAB_SUGGESTED),
        active: this.state.activeTab === 1
      },
      {
        text: 'Requests',
        onPress: () => this.setTab(TAB_PEERREQUESTS),
        active: this.state.activeTab === 2
      }
    ]

    return (
      <Container>
        <AndroidBackButton onPress={() => this._hardwareBack()} />
        
        <LifekeyHeader icons={icons} tabs={tabs} />
        { 
          <View style={{ flex: 1, backgroundColor: Palette.consentGrayLightest }}>
            {
              
              !this.state.asyncActionInProgress ? 
                this.renderTab()
              :
                <ProgressIndicator progressCopy={ this.state.progressCopy }></ProgressIndicator>
            }
          </View>
        }
        <LifekeyFooter
          backgroundColor={ Palette.consentBlue }
          leftButtonText="Me"
          rightButtonText="Scan"
          rightButtonIcon={<ScanIcon width={Design.footerIconWidth} height={Design.footerIconHeight} stroke={Design.footerIconColour} />}
          onPressLeftButton={() => this.navigator.push(Routes.me)}
          onPressRightButton={() => this.navigator.push(Routes.camera.qrCodeScanner)}
        />
      </Container>
    )
  }

  renderTab() {
    
    switch (this.state.activeTab) {
      case TAB_CONNECTED:
        return this.renderConnections()
      case TAB_SUGGESTED:
        return this.renderSuggestedConnections()
      case TAB_PEERREQUESTS:
        return this.renderPeerRequests()
    }
  }

  renderConnections(){

    /* ZERO DATA VIEW */
    if(!this.state.botConnections.length && !this.state.peerConnections.length){
      return (
        <View style={ style.contentContainer }>
          { this.state.userName && 
            <Text style={style.defaultTextContainer}>
              <Text style={ style.defaultFont }>
                Hi there { this.state.userName }, 
                {"\n\n"}
                You have no connections yet, have a look at some
              </Text>
              <Text onPress={() => this.setTab(TAB_SUGGESTED)} style={ Object.assign({}, style.defaultFont, { "color": Palette.consentBlue }) }> suggestions.</Text>
              <Text style={ style.defaultFont }>  
                {"\n\n"}
                Or, start setting up your public
              </Text>
              <Text onPress={this.onBoundPressProfile} style={ Object.assign({}, style.defaultFont, { "color": Palette.consentBlue }) }> profile.</Text>
            </Text>
          }
        </View>
      )
    }

    return(
      <View style={style.contentContainer}> 
        <LifekeyList list={this.state.peerConnections} onItemPress={this.onBoundGoToPeerConnectionDetails}/>
        <LifekeyList cxn_unread_msgs={this.cxn_unread_msgs} list={this.state.botConnections} onItemPress={this.onBoundGoToBotConnectionDetails}/>
      </View>
    )
  }

  renderSuggestedConnections(){
    
    /* ZERO DATA VIEW */
    if((!this.state.activeBots) || (!this.state.activeBots.length) ){
      return (
        <View style={ style.contentContainer }>
          { this.state.userName && 
            <Text style={style.defaultTextContainer}>
              <Text style={ style.defaultFont }>
                There are currently no more suggested connections.
              </Text>
            </Text>
          }
        </View>
      )
    }
      
    return(
      <View style={style.contentContainer}> 
        <LifekeyList list={this.state.activeBots} onItemPress={this.onBoundGoToBotConnect}></LifekeyList>
      </View>
    ) 
  }

  renderPeerRequests(){
    
    /* ZERO DATA VIEW */
    if(!this.state.pendingPeerConnections.length){
      return (
        <View style={ style.contentContainer }>
          { this.state.userName && 
            <Text style={style.defaultTextContainer}>
              <Text style={ style.defaultFont }>
                There are currently no peer requests.
              </Text>
            </Text>
          }
        </View>
      )
    }
      
    return(
      <View style={style.contentContainer}> 
        <LifekeyList list={this.state.pendingPeerConnections} onItemPress={this.onBoundGoToPeerConnect}></LifekeyList>
      </View>
    ) 
  }
}

const style = {
  contentContainer: {
    flex: 1,
  },
  listItem: {
    marginLeft: -Design.paddingRight / 2.5,
    marginRight: -Design.paddingRight / 2.5,
    minHeight: 50
  },
  listItemWrapper: {
    flex: 1,
    marginLeft: Design.paddingRight,
    marginRight: Design.paddingRight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemText: {
    fontSize: 18,
    flex: 1,
    marginLeft: 10
  },
  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 45,
    marginLeft: 10
  },
  "defaultTextContainer":{
    "paddingTop": 50,
    "padding": Design.paddingRight*2
  },
  "defaultFont":{
    fontFamily: Design.fonts.registration,
    fontWeight: Design.fontWeights.light,
    fontSize: 24,
    lineHeight: 28
  },
}

Main.contextTypes = {
  // behavior
  "onEditResource": PropTypes.func,
  "onSaveResource": PropTypes.func,

  // state
  "getShouldClearResourceCache": PropTypes.func
}

export default Main
