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
import { Button, Input, H1, H5 } from 'nachos-ui'

import BackButton from '../Components/BackButton'


export default class Debug extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      keystoreFound: false,
      storageDump: null
    }
  }

  _checkForKeystore() {
    Crypto.getKeyStoreList()
    .then(list => {
      if (list.find(x => x === "consent")) {
        this.setState({ keystoreFound: true })
        Session.update({ keyStoreExists: true })
      } else {
        this.setState({ keystoreFound: false })
        Session.update({ keyStoreExists: false })
      }
    })
    .catch(error => alert(error))
  }

  _readStorage() {
    Storage.load(Config.storage.dbKey)
    .then((data) => {
      this.setState({ storageDump: JSON.stringify(data) })
    })
    .catch((err) => {
      Logger.error(err, this._fileName)
    })
  }

  componentWillMount() {
    super.componentWillMount()
    this._checkForKeystore()
    this._readStorage()
  }

  componentWillFocus() {
    super.componentWillFocus()
    this._checkForKeystore()
    this._readStorage()
  }

  render() {

    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <View style={{ alignItems: 'center' }}>
            <H1>Developer Menu</H1>
            <Text>{ this.state.keystoreFound ? "Keypair detected" : "No keypair detected" }</Text>
          </View>

          <Button iconName="md-key" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugKeyStore)}>Keystore Manager</Button>
          <Button iconName="md-reverse-camera" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.selfieCam)}>Self-facing Camera</Button>
          <Button iconName="md-contact" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugRegister)}>{ this.state.keystoreFound ? "Unlock/Login" : "Register on Consent" }</Button>

          { this.state.keystoreFound ?
          [
            <Button key={1} iconName="md-globe" kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugConnectionRequest)}>QR Connection Request</Button>,
            <Button key={2} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugViewConnectionRequests)}>Connection Requests</Button>,
            <Button key={3} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugViewConnections)}>Connections</Button>,
            <Button key={4} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugListAllResources)}>User Resources</Button>,
            <Button key={5} kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugShowQRCode)}>View QR Code</Button>
          ]
          : null }

          <View>
            <H5>Session</H5>
            <Text>{JSON.stringify(Session.getState(), '\t', 2)}</Text>
            <H5>Storage</H5>
            <Text>{this.state.storageDump === null ? "No storage" : this.state.storageDump}</Text>
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
