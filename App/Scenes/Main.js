/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
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
  Image
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
    this.fetchingData = false;
  }

  componentDidFocus() {
    super.componentDidFocus()
    this._onAttention()
  }

  async fetchServerData(connections) {
    const profileStart = new Date().getTime()
    // Get an array of requests for profiles
    let requests = connections.map(connection =>
      Api.profile({ did: connection.to_did }))

    // Push annother request on
    requests.push(Api.getActiveBots())

    // Make requests
    let responses = await Promise.all(requests)

    // Pop the active bots response off the stack
    const activeBotsResponse = responses.pop()

    const updatedConnections = connections.map((connection, i) =>
      _.assign(connection, { image_uri: responses[i].body.user.image_uri })
    )

    if (activeBotsResponse && typeof activeBotsResponse.body === 'object') {
      this.setState({
        connections: updatedConnections,
        suggestedConnections: activeBotsResponse.body
      }, () => {
        Logger.info("Fetching data took " + (new Date().getTime() - profileStart) + " ms")
      })
    }

  }

  _onAttention() {
    if (!this.fetchingData) {
      this.fetchingData = true
      return ConsentConnection.all()
      .then(result => {
        if (_.isArray(result)) {
          this.setState({
            connections: result
          }, () => {
            try {
              this.fetchServerData(this.state.connections)
            } catch (error) {
              Logger.warn(error)
            }
          })
        }
      })

    }
  }
/*
{"error":false,"status":200,"message":"ok","body":[{"display_name":null,"nickname":"trustbank-bot","did":"3e699ce5b77bc25e72826233bad77f463410764956d41d3a41cc0e67fbdd5ebf","actions_url":"https://ceaf6e6b.ngrok.io/actions"},{"display_name":"IDBot + TIM proof of residence, and -id","nickname":"idbot-rc1","did":"a367593a7a7b4ebf0ab938236d6285b2627b85a6627cd02e22a2da0cca24a1c1","actions_url":"http://port8505.dev.cnsnt.io/idbot-rc1-actions"}]}
*/
  componentWillMount() {
    super.componentWillMount()
    this._onAttention()
  }

  setTab(tab) {
    this.setState({
      activeTab: tab,
    })
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

  connect(connection) {
    this.navigator.push({
      ...Routes.connection,
      did: connection.did,
      display_name: connection.display_name
    })
  }

  render() {
    return (
      <Container>
        <View style={style.headerWrapper}>
          <AndroidBackButton onPress={() => this._hardwareBack()} />
          <LifekeyHeader
            icons={[
              {
                icon: <Image source={require("../Images/torn_page.png")}/>,
                onPress: () => this.navigator.push(Routes.messages)
              },
              {
                icon: <HexagonIcon fill={ ConsentUser.getDidSync() ? Palette.consentBlue : 'red' }/>,
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
                        onPress={() => this.navigator.push({
                          ...Routes.connectionDetails,
                          user_did: connection.to_did,
                          id: connection.id,
                          display_name: connection.display_name
                        })}
                      >
                        <Text>
                          {`${connection.display_name}`}
                        </Text>
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
                      onPress={() => this.connect(this.state.suggestedConnections[i])}
                    >
                      <Text>{suggestedConnection.display_name}</Text>
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
    flex: 1,
    paddingLeft: 20
  },
  listItemLabel: {
    backgroundColor: Palette.consentGrayDark
  },
  footer: {
    height: Dimensions.get('window').height / 6
  }
}
