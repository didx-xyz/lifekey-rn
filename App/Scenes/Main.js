import React, { Component } from 'react'
import { InteractionManager } from 'react-native'
import PropTypes from "prop-types"
import ActivityIndicator from "ActivityIndicator"
import AppLogo from '../Images/logo_big.png'
import Scene from '../Scene'
import Design from '../DesignParameters'
import Palette from '../Palette'
import Api from '../Api'
import Session from '../Session'
import Config from '../Config'
import Logger from '../Logger'
import Routes from '../Routes'
import LifekeyHeader from '../Components/LifekeyHeader'
import LifekeyFooter from '../Components/LifekeyFooter'
import LifekeyList from '../Components/LifekeyList'
import Touchable from '../Components/Touchable'
import AndroidBackButton from 'react-native-android-back-button'
import ConsentConnection from '../Models/ConsentConnection'
import HexagonIcon from '../Components/HexagonIcon'
import ConsentUser from '../Models/ConsentUser'
import SearchBox from '../Components/SearchBox'
import ThanksIcon from '../Components/ThanksIcon'
import SlipIcon from '../Components/SlipIcon'
import ProgressIndicator from "../Components/ProgressIndicator"

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

class Main extends Scene {

  constructor(props) {
    super(props)
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
    this.interaction = InteractionManager.runAfterInteractions(() => {   
      this.loadConnections()
      this.loadProfile()
      // this.loadActiveClients()
      this.refreshThanksBalance()
    })
  }
  
  componentDidFocus() {
    // super.componentDidFocus()
    // this.loadConnections()
    // this.loadProfile()
    // this.loadActiveClients()
    // this.refreshThanksBalance()
  }

  componentWillUnmount() {
    if(this.interaction) this.interaction.cancel()
  }

  async loadProfile() {
    let userName
    try {
      var userData = await Api.getMyData()
      userName = userData.resourcesByType.find(rt => rt.name === 'Person').items[0].firstName
    } catch(e) {
      console.log('thanks balance', e)
    }
    
    this.setState({
      userName: userName
    })
  }

  async refreshThanksBalance() {
    try {
      var balance = await ConsentUser.refreshThanksBalance()
    } catch (e) {
      console.log('thanks balance', e)
      this.setState({
        asyncActionInProgress: false,
        thanksBalanceAmount: '0'
      })
      return
    }
    this.setState({
      asyncActionInProgress: false,
      thanksBalanceAmount: balance
    })
  }

  async loadConnections(callback) {
    
    Api.getMyConnections().then(connections => {

      this.setState({
        "peerConnections": connections.peerConnections,
        "botConnections": connections.botConnections,
        "pendingPeerConnections": connections.pendingPeerConnections,
        "pendingBotConnections": connections.pendingBotConnections,
        "asyncActionInProgress": false
      })

    })
    .catch(error => {
      console.log("ERROR LOADING CONNECTIONS: ", error)
    })

    // return Promise.all([
    //   Api.allConnections(),
    //   Api.getActiveBots()
    // ]).then( async values => {


    //   console.log("ENABLED ORIGINAL: ", values[0].body.enabled)
    //   console.log("UNENABLED ORIGINAL: ", values[0].body.unacked)


    //   const enabledConnections = (await this.getConnectionProfiles(values[0].body.enabled, "other_user_did")) 
    //                                         .map(connection => connection.body.user)

    //   const enabledPeerConnections = enabledConnections.filter(connection => connection.is_human)
    //                                                    .map(connection => { 
    //                                                      const original = values[0].body.enabled.find(obj => obj.other_user_did === connection.did)
    //                                                      return Object.assign({}, connection, { user_connection_id: original.user_connection_id, image_uri: `data:image/jpg;base64,${connection.image_uri}` })
    //                                                    })

    //   const enabledBotConnections = enabledConnections.filter(connection => !connection.is_human)

    //   console.log("ENABLED PEERS: ", enabledPeerConnections)
    //   console.log("ENABLED BOTS: ", enabledBotConnections)

    //   const pendingPeerConnections = (await this.getConnectionProfiles(values[0].body.unacked, "from_did"))
    //                                             .map(connection => connection.body.user)
    //                                             .filter(connection => connection.is_human)
    //                                             .map(connection => { 
    //                                               const original = values[0].body.unacked.find(obj => obj.from_did === connection.did)
    //                                               return Object.assign({}, connection, { user_connection_request_id: original.user_connection_request_id })
    //                                             })
    //                                             .map(connection => Object.assign({}, connection, { image_uri: `data:image/jpg;base64,${connection.image_uri}` }))

    //   const pendingBotConnections = (await this.getConnectionProfiles(values[1].body, "did"))
    //                                            .map(x => x.body.user)
    //                                            .filter(x => !x.is_human)
    //                                            .filter(x => !enabledConnections.some(y => x.did === y.did))

    //   console.log("PENDING PEERS: ", pendingPeerConnections)
    //   console.log("PENDING BOTS: ", pendingBotConnections)

    //   this.setState({
    //     "peerConnections": enabledPeerConnections,
    //     "botConnections": enabledBotConnections,
    //     "pendingPeerConnections": pendingPeerConnections,
    //     "pendingBotConnections": pendingBotConnections,
    //     "asyncActionInProgress": false
    //   })

    // }).catch(error => {
    //   Logger.error(error)
    // })

  }

  // async getConnectionProfiles(connections, propertyName){

  //   return Promise.all(
  //     connections.map(connection => {
  //       return Api.profile({did: connection[propertyName]})
  //     })
  //   )

  // }

  // async loadActiveClients(activeBots, establishedConnections) {

  //   try {

  //     const activeBotsNotYetConnected = updatedSuggestedConnections.filter(x => !establishedConnections.some(y => x.did === y.to_did))

  //     return Promise.resolve(activeBotsNotYetConnected)
  //   } 
  //   catch (e) {
  //     console.log('profile requests', e)
  //     this.setState({
  //       asyncActionInProgress: false,
  //       suggestedConnections: []
  //     })
  //     return
  //   }

  // }

  setTab(tab) {
    switch (tab) {
      case TAB_CONNECTED:
        this.setState({activeTab: tab})
        // this.setState({
        //   activeTab: tab,
        //   progressCopy: 'Loading connections...',
        //   asyncActionInProgress: true
        // }, this.loadConnections.bind(this))
      break
      case TAB_SUGGESTED:
        this.setState({activeTab: tab})
        // this.setState({
        //   activeTab: tab,
        //   progressCopy: 'Loading suggestions...',
        //   asyncActionInProgress: true
        // }, this.loadActiveClients.bind(this))
      break
      default:
        this.setState({activeTab: tab})
        // this.setState({
        //   activeTab: tab,
        //   progressCopy: 'Loading connections...',
        //   asyncActionInProgress: true
        // }, this.loadConnections.bind(this))
      break
    }
  }

  updateSearch(text) {
    this.setState({searchText: text})
  }

  clearSearch() {
    this.setState({searchText: ''})
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
      user_did: connection.did,
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

  renderListItem(list, onItemPress){
    return(   
      list.map((connection, i) => (
        <ListItem key={i} style={style.listItem} onPress={onItemPress.bind(this, connection)}>
          <View style={style.listItemWrapper}>
            <Image style={style.listItemImage} source={{ uri: connection.image_uri }}/>
            <Text style={style.listItemText}>{connection.display_name}</Text>
          </View>
        </ListItem>
      ))
    )
  }

  render() {

    var icons= [
      {
        icon: (<SlipIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Palette.consentGrayDark} />),
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
        icon: (<ThanksIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Palette.consentGrayDark} />),
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
                <View style={{ flex: 1 }}>
                  
                  { 
                    this.state.activeTab === 0 ?

                    (
                      (!this.state.botConnections.length && !this.state.peerConnections.length) ?
                        /* ZERO DATA VIEW */ 
                        <View style={ style.contentContainer }>
                          { this.state.userName && 
                            <Text>
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
                      :
                        <View style={style.contentContainer}> 
                          <LifekeyList list={this.state.peerConnections} onItemPress={this.onBoundGoToPeerConnectionDetails}></LifekeyList>
                        { /* this.renderListItem(this.state.peerConnections, this.onBoundGoToPeerConnectionDetails) */}
                          <LifekeyList list={this.state.botConnections} onItemPress={this.onBoundGoToBotConnectionDetails}></LifekeyList>
                        { /* this.renderListItem(this.state.botConnections, this.onBoundGoToBotConnectionDetails) */ }
                        </View>
                    )
                      /* CONNECTED VIEW */
                      //  <View style={ style.contentContainer }>
                      //   { this.state.connections.map((connection, i) => (
                      //       <ListItem key={i} style={style.listItem} onPress={() => this.goToConnectionDetails(this.state.connections[i])}>
                      //         <View style={style.listItemWrapper}>
                      //           <Image style={style.listItemImage} source={{ uri: connection.image_uri }}/>
                      //           <Text style={style.listItemText}>{connection.display_name}</Text>
                      //         </View>
                      //       </ListItem>
                      //     ))
                      //   }
                      // </View> 
                  :
                    !this.state.pendingPeerConnections.length && !this.state.pendingBotConnections ?
                      <View style={ style.contentContainer }>
                        { this.state.userName && 
                          <Text>
                            <Text style={ style.defaultFont }>
                              There are currently no more suggested connections.
                            </Text>
                          </Text>
                        }
                      </View>
                    :
                      <View style={style.contentContainer}> 
                        <LifekeyList list={this.state.pendingPeerConnections} onItemPress={this.onBoundGoToPeerConnect}></LifekeyList>
                      { /* this.renderListItem(this.state.pendingPeerConnections, this.onBoundGoToPeerConnect) */ }
                        <LifekeyList list={this.state.pendingBotConnections} onItemPress={this.onBoundGoToBotConnect}></LifekeyList>
                      { /* this.renderListItem(this.state.pendingBotConnections, this.onBoundGoToBotConnect) */ }
                      </View>

                    /* SUGGESTED TAB */
                    // <View style={{ flex: 1 }}>
                    //   { this.state.suggestedConnections.map((suggestedConnection, i) => (
                    //     <ListItem key={i} style={style.listItem} onPress={() => this.goToConnect(this.state.suggestedConnections[i])}>
                    //         <View style={style.listItemWrapper}>
                    //           <Image style={style.listItemImage} source={{ uri: suggestedConnection.image_uri }} />
                    //           <Text style={style.listItemText}>{suggestedConnection.display_name}</Text>
                    //         </View>
                    //     </ListItem>
                    //   ))}
                    // </View>
                  }

                </View>
              :
                <ProgressIndicator progressCopy={ this.state.progressCopy }></ProgressIndicator>
            }
          </View>
        }
        <LifekeyFooter
          backgroundColor={ Palette.consentBlue }
          leftButtonText="Me"
          rightButtonText="Scan"
          rightButtonIcon={<ThanksIcon width={Design.footerIconWidth} height={Design.footerIconHeight} stroke={Palette.consentWhite} />}
          onPressLeftButton={() => this.navigator.push(Routes.me)}
          onPressRightButton={() => this.navigator.push(Routes.camera.qrCodeScanner)}
        />
      </Container>
    )
  }
}

const style = {
  contentContainer: {
    flex: 1,
    // padding: Design.paddingRight
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
  "defaultFont":{
    fontFamily: Design.fonts.registration,
    fontWeight: Design.fontWeights.light,
    fontSize: 38,
    lineHeight: 48
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
