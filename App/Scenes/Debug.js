/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'

import {
  Text,
  ScrollView
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import { Button, Input } from 'nachos-ui'
import { NativeModules } from 'react-native'

export default class Debug extends Scene {

  componentDidMount() {
    this._newKeyPair()
  }

  _newKeyPair() {
    NativeModules.Keystore.newKeyPair(13, "test123", "pass123", "cacert.pem").then((x) => {
      console.log('RNKEYSTORE', x, 'then')
    })
    .catch((e) => {
      console.log('RNKEYSTORE', e, 'e')
    })
  }

  render() {
    return (
      <Container>
        <Content>
          <Button onPress={() => this._newKeyPair()}/>
        </Content>
      </Container>
    )
  }
}
