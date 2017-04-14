/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import Scene from '../Scene'
import Palette from '../Palette'
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

import {
  Text,
  View,
  Dimensions
} from 'react-native'
import {
  Container,
  Col,
  Footer,
  ListItem,
  Content,
  Input,
  Image
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'

const TAB_CONNECTED = 0
const TAB_SUGGESTED = 1

export default class Main extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: TAB_CONNECTED,
      searchText: '',
      connections: [],
      suggestedConnections: Config.suggestedConnections
    }
  }

  componentWillFocus() {
    super.componentWillFocus()
    this._onAttention()
  }

  _onAttention() {
    ConsentConnection.all()
    .then(result => {
      this.setState({
        connections: result
      })
    })
    .catch(error => {
      Logger.error(error, this._filename, error)
    })
  }

  componentWillMount() {
    super.componentWillFocus()
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
        <View style={{ borderColor: Palette.consentGrayDark, height: 89 }}>
          <AndroidBackButton onPress={() => this._hardwareBack()} />
          <LifekeyHeader
            icons={[
              {
                icon: <Text>+</Text>,
                onPress: () => alert('test')
              },
              {
                icon: <HexagonIcon/>,
                onPress: () => alert('test'),
                onLongPress: () => {
                  if (Config.DEBUG) {
                    this.navigator.push(Routes.debug.main)
                  }
                }
              },
              {
                icon: <Text>+</Text>,
                onPress: () => alert('test')
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
                /* CONNECTED */
                <View style={{ flex: 1 }}>
                { /* TODO: make into searchbox component */ }
                  <View style={style.searchBox}>
                      <Icon
                        style={style.searchBoxSearchIcon}
                        name="search" size={20}
                        color={Palette.consentGrayDark}
                      />
                      <Input
                        value={this.state.searchText}
                        onChangeText={(text) => this.updateSearch(text)}
                        style={Object.assign(
                          style.searchBoxInput,
                          { borderTopRightRadius: this.state.searchText ? null : 10,
                            borderBottomRightRadius: this.state.searchText ? null : 10 }
                        )}
                        placeholder="Search"
                      />
                      { this.state.searchText !== '' &&
                        <Touchable onPress={() => this.clearSearch()}>
                          <Icon
                            style={style.searchBoxCloseIcon}
                            name="times-circle"
                            size={25}
                            color={Palette.consentGrayDark}
                          />
                        </Touchable>
                      }
                  </View>

                  {this.state.connections.filter((connection) => {
                    if (this.state.searchText !== '') {
                      const connectionSubUpper = connection.name.substr(0, this.state.searchText.length).toUpperCase()
                      const searchTextUpper = this.state.searchText.toUpperCase()
                      return connectionSubUpper === searchTextUpper
                    } else {
                      return true
                    }
                  }).map((connection, i) => (
                      <ListItem
                        key={i}
                        style={style.listItem}
                        onPress={() => this.navigator.push({
                          ...Routes.connectionDetails,
                          connection_to: connection.to_did,
                          connection_id: connection.id,
                          display_name: connection.display_name
                        })}
                      >
                        <Text>
                          {`${connection.display_name} - ${connection.to_did} - ${connection.id}`}
                        </Text>
                      </ListItem>
                  ))}

                </View>
                :
                /* SUGGESTED */
                <View style={{ flex: 1 }}>
                  {this.state.suggestedConnections.map((suggestedConnection, i) => (
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
  listItem: {
    flex: 1,
    paddingLeft: 20
  },
  listItemLabel: {
    backgroundColor: Palette.consentGrayDark
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    borderWidth: 2,
    borderColor: Palette.consentGrayMedium,
    borderRadius: 10,
  },
  searchBoxInput: {
    flex: 1,
    backgroundColor: 'white',
    fontSize: 17,
    padding: 2
  },
  searchBoxSearchIcon: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 5,
    paddingTop: 10,
    paddingLeft: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  searchBoxCloseIcon: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 5,
    paddingTop: 8,
    paddingRight: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  footer: {
    height: Dimensions.get('window').height / 6
  }
}
