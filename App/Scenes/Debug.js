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

import {
  Text,
  StyleSheet,
  View
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import { Button, Input, H1 } from 'nachos-ui'
import { NativeModules } from 'react-native'
import AndroidBackButton from 'react-native-android-back-button'

export default class Debug extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      keystoreFound: false
    }
  }

  _checkForKeystore() {
    Crypto.getKeyStoreList()
    .then(list => {
      if (list.find(x => x === "consent")) {
        this.setState({ keystoreFound: true })
        Session.update({ registered: true })
      } else {
        this.setState({ keystoreFound: false })
        Session.update({ registered: false })
      }
    })
    .catch(error => alert(error))
  }

  componentWillMount() {
    super.componentWillMount()
    this._checkForKeystore()
  }

  componentWillFocus() {
    super.componentWillFocus()
    this._checkForKeystore()
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }
  _newKeyPair() {
    NativeModules.Keystore.newKeyPair(13, "test1234", "pass123", "rsa-example.pem").then((x) => {
      console.log('RNKEYSTORE')
      console.log(x)

    })
    .catch((e) => {
      console.log('RNKEYSTORE', e, 'e')
    })
  }

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <View style={{ alignItems: 'center' }}>
            <H1>Lifekey Tech Demo</H1>
            <Text>{ this.state.keystoreFound ? "Keypair detected" : "No keypair detected" }</Text>
          </View>
          <Button iconName="md-key" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugKeyStore)}>Keystore Manager</Button>
          {/* <Button iconName="md-qr-scanner" kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.scanQrCode)}>QR Code Scanner</Button> */}
          <Button iconName="md-reverse-camera" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.selfieCam)}>Self-facing Camera</Button>
          {/* <Button iconName="md-document" kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.formGenerator)}>JSON Form Generator</Button> */}
          <Button iconName="md-contact" kind="squared" type="success" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugRegister)}>{ this.state.keystoreFound ? "Unlock/Login" : "Register on Consent" }</Button>
          {/* <Button iconName="md-flame" kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.animation)}>Animation</Button> */}
          <Button iconName="md-globe" kind="squared" style={[styles.btn]} onPress={() => this.navigator.push(Routes.debugConnectionRequest)}>QR Connection Request</Button>
          <Button iconName="md-no-smoking" kind="squared" style={[styles.btn]} onPress={() => alert("No smoking!")}>No smoking</Button>
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
