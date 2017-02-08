/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'

import {
  Text
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import { Button } from 'nachos-ui'
import { NativeModules } from 'react-native'

export default class KeypairGenerator extends Scene {


  constructor(props) {
    super(props)
    this.state = {

    }
    this.keystoreFilename = "asdasdas"
    this.keystorePassword = "test123"
    this.keystoreType = "AndroidKeyStore"
  }
  _generate() {
    // NativeModules.Keystore.create("name", "pass")
    // .then(() => alert('done') )
    // .catch((e) => alert(e))
    NativeModules.Keystore.listStores()
    .then((fileNames) => alert(fileNames))
    .catch((e) => alert(e))
  }

  _list() {
    NativeModules.Keystore.listStores()
    .then((x) => alert(x))
    .catch((e) => alert(e))
  }

  _create() {
    NativeModules.Keystore.create("keystoreName", "keystorePassword")
    .then((x) => {
      alert(x)
    })
    .catch((e) => {
      alert(e)
    })
  }

  _load() {
    NativeModules.Keystore.load("keystoreName", "keystorePassword")
    .then((x) => {
      alert(x)
    })
    .catch((e) => {
      alert(e)
    })
  }


  render() {
    return (
      <Container>
        <Content>
          <Button onPress={() => this._generate()}> Generate </Button>
          <Button onPress={() => this._create()}> Create </Button>
          <Button onPress={() => this._list()}> List </Button>
          <Button onPress={() => this._load()}> Load </Button>

        </Content>
      </Container>
    )
  }
}
