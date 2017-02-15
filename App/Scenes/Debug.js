/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Routes from '../Routes'
import {
  Text,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import { Button, Input, H1 } from 'nachos-ui'
import { NativeModules } from 'react-native'

export default class Debug extends Scene {

  componentDidMount() {
    // this._newKeyPair()
    // alert(NativeModules.Keystore.ANDROID_CA_STORE)
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
          <View style={{ alignItems: 'center' }}>
            <H1>Lifekey Tech Demo</H1>
          </View>
          <Button style={[styles.btn]} onPress={() => this.navigator.push(Routes.keyPairGenerator)}>RSA Keypair Generator</Button>
          <Button style={[styles.btn]} onPress={() => this.navigator.push(Routes.scanQrCode)}>QR Code Scanner</Button>
          <Button style={[styles.btn]} onPress={() => this.navigator.push(Routes.selfieCam)}>Self-facing Camera</Button>
          <Button style={[styles.btn]} onPress={() => this.navigator.push(Routes.formGenerator)}>JSON Form Generator</Button>
          <Button style={[styles.btn]} onPress={() => this.navigator.push(Routes.apiTest)}>API Test</Button>
          <Button style={[styles.btn]} onPress={() => this.navigator.push(Routes.animation)}>Animation</Button>
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
