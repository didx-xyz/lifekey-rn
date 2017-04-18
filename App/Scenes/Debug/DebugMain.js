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
import * as Nachos from 'nachos-ui'
import * as Base from 'native-base'

import BackButton from '../../Components/BackButton'
import ConsentConnection from '../../Models/ConsentConnection'
import ConsentConnectionRequest from '../../Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from '../../Models/ConsentDiscoveredUser'
import ConsentUser from '../../Models/ConsentUser'
import ConsentISA from '../../Models/ConsentISA'
import DebugButton from '../../Components/DebugButton'

export default class DebugMain extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      connections: [],
      connectionRequests: [],
      discoveredUsers: [],
      user: {},
      isas: []
    }
  }

  componentWillMount() {
    super.componentWillMount()

    Promise.all([
      ConsentConnection.all(),
      ConsentConnectionRequest.all(),
      ConsentDiscoveredUser.all(),
      ConsentUser.get(),
      ConsentISA.all()
    ])
    .then(results => {
      let newState = {
        connections: results[0] || [],
        connectionRequests: results[1] || [],
        discoveredUsers: results[2] || [],
        user: results[3] || {},
        isas: results[4] || []
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
      <Base.Container>
        <Base.Content>

          <BackButton navigator={this.navigator} />

          <View style={{ alignItems: 'center' }}>
            <Nachos.H1>Developer Menu</Nachos.H1>
          </View>

          { /* Any state */}
          <View style={{ marginLeft: 10, marginRight: 10 }}>

            <DebugButton text="Keystore" iconName="md-key"
              onPress={() => this.navigator.push(Routes.debug.keystore)}
            />

            <DebugButton text="Consent Account" iconName="md-contact"
              onPress={() => this.navigator.push(Routes.debug.register)}
            />

            <DebugButton text="View Config" iconName="ios-settings"
              onPress={() => this.navigator.push(Routes.debug.configuration)}
            />

            <DebugButton text="Async Storage" iconName="ios-settings"
              onPress={() => this.navigator.push(Routes.debug.asyncStorage)}
            />

          </View>

          { /* Logged in only */ }
          {Session.getState().user && Session.getState().user.loggedIn &&
            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <Nachos.Button kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debug.connectionRequest)}>Connection Requests</Nachos.Button>
            </View>
          }

          <View>
            <Nachos.H3>Session</Nachos.H3>
            <Text>{JSON.stringify(Session.getState(), '\t', 2)}</Text>
            <Nachos.H3>Storages</Nachos.H3>
            <Nachos.H5>User</Nachos.H5>
            <Text>{JSON.stringify(this.state.user, '\t', 2)}</Text>
            <Nachos.H5>Connections</Nachos.H5>
            <Text>{JSON.stringify(this.state.connections, '\t', 2)}</Text>
            <Nachos.H5>Connection Requests</Nachos.H5>
            <Text>{JSON.stringify(this.state.connectionRequests, '\t', 2)}</Text>
            <Nachos.H5>Information Sharing Agreements</Nachos.H5>
            <Text>{JSON.stringify(this.state.isass, '\t', 2)}</Text>
            <Nachos.H5>Discovered Users</Nachos.H5>
            <Text>{JSON.stringify(this.state.discoveredUsers, '\t', 2)}</Text>
          </View>
        </Base.Content>
      </Base.Container>
    )
  }

}

const styles = {
  btn: {
    margin: 5
  }
}
