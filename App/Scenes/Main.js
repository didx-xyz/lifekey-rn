/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Palette from '../Palette'
import Routes from '../Routes'
import Config from '../Config'
import LifekeyHeader from '../Components/LifekeyHeader'
import LifekeyFooter from '../Components/LifekeyFooter'
import Touchable from '../Components/Touchable'
import AndroidBackButton from 'react-native-android-back-button'

import {
  Text,
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import {
  Container,
  Header,
  Title,
  Col,
  Button,
  Footer,
  Body,
  FooterTab,
  ListItem,
  Content,
  Row,
  Item,
  Input,

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
      suggestedConnections: []
    }
  }

  componentWillMount() {
    // DEBUG / DEMO data source
    const connections = [
      { name: 'Absa', icon: 'rocket' },
      { name: 'Woolworths', icon: 'rocket' },
      { name: 'ThisIsMe', icon: 'rocket' },
      { name: 'Totally Me', icon: 'rocket' },
      { name: 'ItCouldBeMe', icon: 'rocket' },
      { name: 'SoTotesMe', icon: 'rocket' },
      { name: 'NotMeThough', icon: 'rocket' },
      { name: 'SomethingElse', icon: 'rocket' },
      { name: 'OutOfIdeas', icon: 'rocket' },
    ]

    const suggestedConnections = [
      { name: 'Telkom', icon: 'rocket' },
      { name: 'Postbank', icon: 'rocket' },
      { name: 'City of Cape Town', icon: 'rocket' },
      { name: 'Investec', icon: 'rocket' }
    ]
    this.setState({
      connections,
      suggestedConnections
    })
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

  render() {
    return (
      <Container>
        <View style={{ borderColor: Palette.consentGrayDark, height: 120 }}>
          <AndroidBackButton onPress={() => this._hardwareBack()} />
          <LifekeyHeader
            onPressBottomLeft={() => this.setTab(TAB_CONNECTED) }
            onPressBottomRight={() => this.setTab(TAB_SUGGESTED) }
            icons={[
              <Text>Test1</Text>,
              <Text>Test2</Text>,
              <Text>Test3</Text>
            ]}
            tabs={[
              { text: 'Connected', onPress: () => this.setTab(TAB_CONNECTED), active: this.state.activeTab === 0 },
              { text: 'Suggested', onPress: () => this.setTab(TAB_SUGGESTED), active: this.state.activeTab === 1 }
            ]}
          />

        </View>
        <Content>
          <Col style={{ flex: 1 }}>

            <View style={{ flex: 10, backgroundColor: Palette.consentGrayLightest }}>
              { this.state.activeTab === 0 ?
                /* CONNECTED */
                <View style={{ flex: 1 }}>
                  <View style={style.searchBox}>
                      <Icon style={style.searchBoxSearchIcon} name="search" size={20} color={Palette.consentGrayDark} />
                      <Input
                        value={this.state.searchText}
                        onChangeText={(text) => this.updateSearch(text)}
                        style={[
                          style.searchBoxInput,
                          { borderTopRightRadius: this.state.searchText ? null : 10,
                            borderBottomRightRadius: this.state.searchText ? null : 10 }
                        ]}
                        placeholder="Search"
                      />
                      { this.state.searchText !== '' ?
                        <Touchable onPress={() => this.clearSearch()}>
                          <Icon style={style.searchBoxCloseIcon} name="times-circle" size={25} color={Palette.consentGrayDark} />
                        </Touchable>
                      :
                        null
                      }
                  </View>

                  {
                    this.state.connections.filter((connection) => {
                      if (this.state.searchText !== '') {
                        const connectionSubUpper = connection.name.substr(0, this.state.searchText.length).toUpperCase()
                        const searchTextUpper = this.state.searchText.toUpperCase()
                        return connectionSubUpper === searchTextUpper
                      } else {
                        return true
                      }
                    }).map((connection, i) => (
                      <ListItem key={i} style={style.listItem}>
                        <Text>{connection.name}</Text>
                      </ListItem>
                    ))
                  }

                </View>
                :
                /* SUGGESTED */
                <View style={{ flex: 1 }}>
                  { this.state.suggestedConnections.map((suggestedConnection, i) => (
                      <ListItem key={i} style={style.listItem}>
                        <Text>{suggestedConnection.name}</Text>
                      </ListItem>
                    ))
                  }
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

const style = StyleSheet.create({
  listItem: {
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
})
