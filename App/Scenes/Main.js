/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import AppLogo from '../Images/logo_big.png'
import Scene from '../Scene'
import Palette from '../Palette'
import Api from '../Api'
import Config from '../Config'
import Logger from '../Logger'
import Routes from '../Routes'
import LifekeyHeader from '../Components/LifekeyHeader'
import LifekeyFooter from '../Components/LifekeyFooter'
import Touchable from '../Components/Touchable'
import AndroidBackButton from 'react-native-android-back-button'
import ConsentConnection from '../Models/ConsentConnection'
import Design from '../DesignParameters'
import HexagonIcon from '../Components/HexagonIcon'
import ConsentUser from '../Models/ConsentUser'
import SearchBox from '../Components/SearchBox'
import _ from 'lodash'

import {
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

export default class Main extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: TAB_CONNECTED,
      searchText: '',
      connections: [],
      profiles: [],
      suggestedConnections: Config.hardcodedSuggestedConnections
                            ? Config.suggestedConnections : []
    }
  }

  componentDidFocus() {
    super.componentDidFocus()
    try {
      this.loadConnections()
      this.loadActiveClients()
    } catch (error) {
      Logger.error(error)
    }
  }

  async loadConnections(callback) {
    const connections = await ConsentConnection.all()
    this.setState({ connections: connections }, () => {
      if (callback) { callback() }
    })
  }

  async loadActiveClients(callback) {
    const activeBots = await Api.getActiveBots()
    if (activeBots && activeBots.body && _.isArray(activeBots.body)) {
      const profileRequests = activeBots.body.map((bot) => Api.profile({ did: bot.did }))
      const profileResponses = await Promise.all(profileRequests)
      const updatedSuggestedConnections = profileResponses.map(response => {
        if (response.body && response.body.user) {
          return response.body.user
        } else {
          Logger.warn("Unexpected bot profile data")
          return ({})
        }
      })
      const updatedSuggestedConnectionsWithoutConnected = updatedSuggestedConnections.filter(x =>
        !this.state.connections.find(y => x.did === y.to_did)
      )
      this.setState({ suggestedConnections: updatedSuggestedConnectionsWithoutConnected }, () => {
        if (callback) { callback() }
      })
    } else {
      Logger.warn('Directory listing result unexpected')
    }
  }

  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUpdate(nextProps, nextState) {
    super.componentWillUpdate()
  }

  setTab(tab) {
    try {
      switch (tab) {
      case TAB_CONNECTED:
        this.loadConnections(() => {
          this.setState({ activeTab: tab })
        })
        break
      case TAB_SUGGESTED:
        this.loadActiveClients(() => {
          this.setState({ activeTab: tab })
        })
      }
    } catch (error) {
      Logger.warn(error)
    }
  }

  updateSearch(text) {
    this.setState({
      searchText: text
    })
  }

  clearSearch() {
    this.setState({
      searchText: ''
    })
  }

  _hardwareBack() {
    // Quit
    return false
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
    this.navigator.push({
      ...Routes.connectionDetails,
      user_did: connection.to_did,
      id: connection.id,
      display_name: connection.display_name,
      image_uri: connection.image_uri
    })
  }

  render() {
    return (
      <Container>
        <View style={style.headerWrapper}>
          <AndroidBackButton onPress={() => this._hardwareBack()} />
          <StatusBar hidden={false} />
          <LifekeyHeader
            icons={[
              {
                icon: <Image source={require("../Images/torn_page.png")}/>,
                onPress: () => this.navigator.push(Routes.messages)
              },
              {
                icon: <Image style={{height: "100%", width: "100%"}} source={AppLogo}/>,
                onPress: () => alert('test'),
                onLongPress: () => {
                  if (Config.DEBUG) {
                    this.navigator.push(Routes.debug.main)
                  }
                }
              },
              {
                icon: <Image source={require("../Images/smiley_speech_bubble.png")}/>,
                onPress: () => this.navigator.push(Routes.thanks)
              }
            ]}
            tabs={[
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
            ]}
          />

        </View>
        <Content>
          <Col style={{ flex: 1 }}>
            <View style={{ flex: 10, backgroundColor: Palette.consentGrayLightest }}>
              { this.state.activeTab === 0 ?

                /* CONNECTED TAB */

                <View style={{ flex: 1 }}>

                  <SearchBox
                    text={this.state.searchText}
                    onChangeText={(text) => this.updateSearch(text)}
                  />

                  { /* LIST OF CONNECTIONS */ }
                  {this.state.connections.filter((connection) => {
                    // If not empty
                    if (this.state.searchText !== '') {
                      // uppercase connection name and substring name to search text length
                      const connectionSubUpper = connection.display_name
                                                 .substr(0, this.state.searchText.length)
                                                 .toUpperCase()
                      // uppsercase search text
                      const searchTextUpper = this.state.searchText.toUpperCase()
                      // compare
                      return connectionSubUpper === searchTextUpper
                    } else {
                      // match because no search text
                      return true
                    }
                  }).map((connection, i) => (
                      <ListItem
                        key={i}
                        style={style.listItem}
                        onPress={() => this.goToConnectionDetails(this.state.connections[i])}
                      >
                        <View style={style.listItemWrapper}>
                          <Image
                            style={style.listItemImage}
                            source={{ uri: connection.image_uri }}
                          />
                          <Text style={style.listItemText}>{connection.display_name}</Text>
                        </View>
                      </ListItem>
                  ))}

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
          </Col>
        </Content>
        <Footer style={style.footer}>
          <LifekeyFooter
            leftButtonText="Me"
            rightButtonText="Scan"
            onPressLeftButton={() => this.navigator.push(Routes.me)}
            onPressRightButton={() => this.navigator.push(Routes.camera.qrCodeScanner)}
          />
        </Footer>
      </Container>
    )
  }
}

const style = {
  headerWrapper: {
    borderColor: Palette.consentGrayDark,
    height: Design.lifekeyHeaderHeight
  },
  listItem: {
    marginLeft: 10
  },
  listItemWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10
  },
  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 45,
    marginLeft: 10
  },
  footer: {
    height: Dimensions.get('window').height / 6
  }
}
