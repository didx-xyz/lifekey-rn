/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Routes from '../../Routes'
import Session from '../../Session'
import Logger from '../../Logger'

import { Text, View } from 'react-native'

import { Container, Content } from 'native-base'
import { Button, H1, H3, H5 } from 'nachos-ui'

import BackButton from '../../Components/BackButton'
import ConsentConnection from '../../Models/ConsentConnection'
import ConsentConnectionRequest from '../../Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from '../../Models/ConsentDiscoveredUser'
import ConsentUser from '../../Models/ConsentUser'

export default class DebugMain extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      connections: [],
      connectionRequests: [],
      discoveredUsers: [],
      user: {}
    }
  }

  componentWillMount() {
    super.componentWillMount()

    Promise.all([
      ConsentConnection.all(),
      ConsentConnectionRequest.all(),
      ConsentDiscoveredUser.all(),
      ConsentUser.get()
    ])
    .then(results => {
      let newState = {
        connections: results[0],
        connectionRequests: results[1],
        discoveredUsers: results[2],
        user: results[3] || {}
      }
      this.setState(newState)
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
          <Button iconName="md-contact" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugRegister)}>Consent User</Button>

          {/* this.state.user.registered ?
          [
            <Button key={1} iconName="md-globe" kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugConnectionRequest)}>QR Connection Request</Button>,
            <Button key={2} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugViewConnectionRequests)}>Connection Requests</Button>,
            <Button key={3} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugViewConnections)}>Connections</Button>,
            <Button key={4} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugListAllResources)}>User Resources</Button>,
          ]
          : null */}

          <View>
            <H3>Session</H3>
            <Text>{JSON.stringify(Session.getState(), '\t', 2)}</Text>
            <H3>Storages</H3>
            <H5>Connections</H5>
            <Text>{JSON.stringify(this.state.connections, '\t', 2)}</Text>
            <H5>Connection Requests</H5>
            <Text>{JSON.stringify(this.state.connectionRequests, '\t', 2)}</Text>
            <H5>Discovered Users</H5>
            <Text>{JSON.stringify(this.state.discoveredUsers, '\t', 2)}</Text>
            <H5>User</H5>
            <Text>{JSON.stringify(this.state.user, '\t', 2)}</Text>
          </View>
        </Content>
      </Container>
    )
  }

}

const styles = {
  btn: {
    margin: 5
  }
}
