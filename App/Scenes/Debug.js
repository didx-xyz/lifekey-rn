/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Routes from '../Routes'
import Crypto from '../Crypto'
import Session from '../Session'
import Storage from '../Storage'
import Config from '../Config'
import Logger from '../Logger'

import {
  Text,
  View
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import { Button, Input, H1,H3, H5 } from 'nachos-ui'

import BackButton from '../Components/BackButton'
import ConsentConnection from '../Models/ConsentConnection'
import ConsentConnectionRequest from '../Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from '../Models/ConsentDiscoveredUser'

export default class Debug extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      registered: false
    }
  }

  componentWillMount() {
    super.componentWillMount()
    Promise.all([
      ConsentConnection.all(),
      ConsentConnectionRequest.all(),
      ConsentDiscoveredUser.all()
    ])
    .then(results => {
      this.setState({
        connections: results[0],
        connectionsRequests: results[1],
        discoveredUsers: results[2],

      })
    })
    .catch(error => {
      Logger.error(error)
    })
  }

  componentDidMount() {
    super.componentDidMount()
  }

  componentWillFocus() {
    super.componentWillFocus()
  }


  render() {

    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <View style={{ alignItems: 'center' }}>
            <H1>Developer Menu</H1>
          </View>

          <Button iconName="md-key" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugKeyStore)}>Keystore Manager</Button>
          <Button iconName="md-reverse-camera" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.selfieCam)}>Self-facing Camera</Button>
          <Button iconName="md-contact" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugRegister)}>{ this.state.registered ? "Unlock/Login" : "Register on Consent" }</Button>

          { this.state.registered ?
          [
            <Button key={1} iconName="md-globe" kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugConnectionRequest)}>QR Connection Request</Button>,
            <Button key={2} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugViewConnectionRequests)}>Connection Requests</Button>,
            <Button key={3} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugViewConnections)}>Connections</Button>,
            <Button key={4} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugListAllResources)}>User Resources</Button>,
            <Button key={5} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugShowQRCode)}>View QR Code</Button>
          ]
          : null }

          <View>
            <H3>Session</H3>
            <Text>{JSON.stringify(Session.getState(), '\t', 2)}</Text>
            <H3>Storages</H3>
            <H5>Connections</H5>
            <Text>{JSON.stringify(this.state.connections)}</Text>
            <H5>Connection Requests</H5>
            <Text>{JSON.stringify(this.state.connectionsRequests)}</Text>
            <H5>Discovered Users</H5>
            <Text>{JSON.stringify(this.state.discoveredUsers)}</Text>

          </View>
        </Content>
      </Container>
    )
  }

  _getConnections() {
    ConsentConnection.all()
    .then(connections => {
      this.setState({
        connections
      })
    })
    .catch(error => {
      console.log(error)
    })
  }

}

const styles = {
  btn: {
    margin: 5
  }
}
