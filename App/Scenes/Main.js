/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Svg, {Circle} from 'react-native-svg'
import React, { Component } from 'react'
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
import Touchable from '../Components/Touchable'
import AndroidBackButton from 'react-native-android-back-button'
import ConsentConnection from '../Models/ConsentConnection'
import HexagonIcon from '../Components/HexagonIcon'
import ConsentUser from '../Models/ConsentUser'
import SearchBox from '../Components/SearchBox'
import ThanksIcon from '../Components/ThanksIcon'
import SlipIcon from '../Components/SlipIcon'
import ProgressIndicator from "../Components/ProgressIndicator"
import ConsentDiscoveredUser from '../Models/ConsentDiscoveredUser'
import _ from 'lodash'

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
    this.first_load = true
    this.is_mounted = false
    this.cxn_unread_msgs = {}
    this.state = {
      activeTab: TAB_CONNECTED,
      searchText: '',
      connections: [],
      profiles: [],
      suggestedConnections: [],
      progressCopy: 'Loading...',
      asyncActionInProgress: true
    }

    this.onBoundPressProfile = this.onPressProfile.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()
    this.props.firebaseInternalEventEmitter.addListener('user_message_received', this.set_unread.bind(this))
    this.is_mounted = true
    Promise.all([
      this.loadConnections(),
      this.loadProfile(),
      this.refreshThanksBalance()
    ]).catch(console.log.bind(console, 'error in component_did_mount'))
  }

  componentWillUnmount() {
    this.props.firebaseInternalEventEmitter.removeListener('user_message_received', this.set_unread.bind(this))
    this.is_mounted = false
  }
  
  componentDidFocus() {
    if (this.first_load) {
      this.first_load = false
      return
    }
    super.componentDidFocus()
    Promise.all([
      this.loadConnections(),
      this.loadProfile(),
      this.refreshThanksBalance()
    ]).catch(console.log.bind(console, 'error in component_did_focus'))
  }

  set_unread(from) {
    this.cxn_unread_msgs[from] = true
  }

  cxn_has_unread(cxn) {
    return this.cxn_unread_msgs[cxn.to_did]
  }

  remove_cxn_from_unread_backlog(cxn) {
    delete this.cxn_unread_msgs[cxn.to_did]
  }

  loadProfile() {
    if (!this.is_mounted || this.state.userName) return
    return Api.getMyData().then(userData => {
      this.setState({
        userName: userData.resourcesByType.find(
          rt => rt.name === 'Person'
        ).items[0].firstName
      }, function() {
        console.log('loadProfile')
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
        asyncActionInProgress: false,
        thanksBalanceAmount: balance
      }, function() {
        console.log('refreshThanksBalance')
      })
    }).catch(err => {
      console.log('thanks balance', err)
      this.setState({
        asyncActionInProgress: false,
        thanksBalanceAmount: '0'
      }, function() {
        console.log('refreshThanksBalance error')
      })
    })
  }

  loadConnections(callback) {
    if (!this.is_mounted) {
      (callback || function() {})()
      return
    }
    return ConsentConnection.all().then(all => {
      this.setState({
        connections: all,
        asyncActionInProgress: false
      }, callback || function() {
        console.log('load_connections')
      })
    }).catch(err => {
      console.log('get all connections error')
      this.setState({
        connections: [],
        asyncActionInProgress: false
      }, callback || function() {
        console.log('load_connections error')
      })
    })
  }

  loadActiveClients(callback) {
    if (!this.is_mounted) {
      (callback || function() {})()
      return
    }
    return Api.getActiveBots().then(activeBots => {
      if (!(activeBots && activeBots.body && Array.isArray(activeBots.body))) {
        return Promise.reject('active bots error')
      }
      return new Promise((resolve, reject) => {
        this.setState({
          progressCopy: 'Sorting suggestions...'
        }, async _ => {
          console.log('loadActiveClients')
          Promise.all(
            activeBots.body.map(bot => {
              return Api.profile({did: bot.did})
            })
          ).then(profileResponses => {
            return Promise.resolve(
              profileResponses.map(response => {
                if (response.body && response.body.user) {
                  return response.body.user
                } else {
                  Logger.warn("Unexpected bot profile data")
                  return {}
                }
              })
            )
          }).then(updatedSuggestedConnections => {
            return Promise.resolve(
              updatedSuggestedConnections.filter(x => {
                return !this.state.connections.find(y => x.did === y.to_did)
              })
            )
          }).then(updatedSuggestedConnectionsWithoutConnected => {
            this.setState({
              asyncActionInProgress: false,
              suggestedConnections: updatedSuggestedConnectionsWithoutConnected
            }, resolve)
          }).catch(reject)
        })
      })
    }).then(callback || function() {
      console.log('loadActiveClients')
    }).catch(err => {
      console.log('get active bots error', err)
      this.setState({
        asyncActionInProgress: false,
        suggestedConnections: []
      }, function() {
        console.log('loadActiveClients error')
      })
    })
  }

  setTab(tab) {
    if (!this.is_mounted) return
    switch (tab) {
      case TAB_CONNECTED:
        this.setState({
          activeTab: tab,
          progressCopy: 'Loading connections...',
          asyncActionInProgress: true
        }, this.loadConnections.bind(this))
      break
      case TAB_SUGGESTED:
        this.setState({
          activeTab: tab,
          progressCopy: 'Loading suggestions...',
          asyncActionInProgress: true
        }, this.loadActiveClients.bind(this))
      break
      default:
        this.setState({
          activeTab: tab,
          progressCopy: 'Loading connections...',
          asyncActionInProgress: true
        }, this.loadConnections.bind(this))
      break
    }
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

  goToConnect(connection) {
    this.navigator.push({
      ...Routes.connection,
      did: connection.did,
      display_name: connection.display_name,
      image_uri: connection.image_uri,
      actions_url: connection.actions_url
    })
  }

  goToConnectionDetails(connection) {
    if (this.cxn_has_unread(connection)) {
      console.log('cxn has unread')
      this.remove_cxn_from_unread_backlog(connection)
    }
    this.navigator.push({
      ...Routes.connectionDetails,
      user_did: connection.to_did,
      id: connection.id,
      display_name: connection.display_name,
      image_uri: connection.image_uri
    })
  }

  onPressProfile() {
    console.log("CONTEXT: ", this.context)
    this.context.onEditResource("http://schema.cnsnt.io/public_profile_form", null, "Public Profile")
    this.navigator.push({ ...Routes.editProfile })
  }

  render() {

    var icons= [
      {
        icon: (<SlipIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Palette.consentGrayDark} />),
        onPress: () => this.navigator.push(Routes.messages),
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
        <StatusBar hidden={false} />
        <LifekeyHeader icons={icons} tabs={tabs} />
        { 

          <View style={{ flex: 1 }}>
            {
              !this.state.asyncActionInProgress ? 
                <View style={{ flex: 1, backgroundColor: Palette.consentGrayLightest }}>
                  
                  { this.state.activeTab === 0 ?

                    !this.state.connections.length ?
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
                      /* CONNECTED VIEW */
                      <View style={ style.contentContainer }>
                        {
                          this.state.connections.map((connection, i) => {
                            return (
                              <ListItem key={i} style={style.listItem} onPress={() => this.goToConnectionDetails(connection)}>
                                <View style={style.listItemWrapper}>
                                  <Image style={style.listItemImage} source={{ uri: connection.image_uri }}/>
                                  <Text style={style.listItemText}>{connection.display_name}</Text>
                                   {this.cxn_has_unread(connection) ? (
                                     <Svg width={20} height={20}>
                                       <Circle cx={10} cy={10} r={5} fill={'#216BFF'} strokeWidth={1} stroke={'#216BFF'} />
                                     </Svg>
                                    ) : null}
                                </View>
                              </ListItem>
                            )
                          })
                        }
                      </View>
                    :
                    /* SUGGESTED TAB */
                    <View style={{ flex: 1 }}>
                      { this.state.suggestedConnections.map((suggestedConnection, i) => (
                        <ListItem
                          key={i}
                          style={style.listItem}
                          onPress={() => this.goToConnect(this.state.suggestedConnections[i])}
                        >
                            <View style={style.listItemWrapper}>
                              <Image
                                style={style.listItemImage}
                                source={{ uri: suggestedConnection.image_uri }}
                              />
                              <Text style={style.listItemText}>{suggestedConnection.display_name}</Text>
                            </View>
                        </ListItem>
                      ))}
                    </View>
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
    padding: Design.paddingRight
  },
  listItem: {
    marginLeft: 10,
    minHeight: 50
  },
  listItemWrapper: {
    flex: 1,
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
