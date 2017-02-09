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
    // this.keystoreFilename = "asdasdas"
    // this.testing123 = "test123"
    // this.keystoreType = "AndroidKeyStore"
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
    NativeModules.Keystore.create("testing123", "testing123")
    .then((x) => {
      alert(x)
    })
    .catch((e) => {
      alert(e)
    })
  }

  _load() {
    NativeModules.Keystore.load("testing123", "testing123")
    .then((x) => {
      alert(x)
    })
    .catch((e) => {
      alert(e)
    })
  }

  _addKeyPair() {
    NativeModules.Keystore.addKeyPair(13, "SOME-KEY", "testing123", "rsa-example.pem")
    .then((keypair) => {
      alert(JSON.stringify(keypair))
    })
    .catch((error) => {
      alert(error)
    })
  }

  _containsAlias() {
   NativeModules.Keystore.containsAlias("SOME-KEY")
    .then((result) => {
      alert(result)
    })
    .catch((error) => alert(error))
  }

  _aliases() {
    NativeModules.Keystore.aliases()
    .then((list) => alert(list))
    .catch((error) => alert(error))
  }

  _deleteEntry() {
    NativeModules.Keystore.deleteEntry("alias")
    .then((result) => alert(result))
    .catch((error) => alert(error))
  }

  _getCertificate() {
    NativeModules.Keystore.getCertificate("alias")
    .then((result) => alert(result))
    .catch((error) => alert(error))
  }

  _size() {
    NativeModules.Keystore.size()
    .then((size) => alert(size))
    .catch(error => alert(error))
  }

  _deleteStore() {
    NativeModules.Keystore.deleteStore("testing123")
    .then((x) => alert(x))
    .catch((e) => alert(e))
  }

  render() {
    return (
      <Container>
        <Content>
          <Button onPress={() => this._create()}> Create store</Button>
          <Button onPress={() => this._list()}> List stores</Button>
          <Button onPress={() => this._load()}> Load store</Button>
          <Button onPress={() => this._addKeyPair()}> Create and Store RSA keys </Button>
          <Button onPress={() => this._containsAlias()}> Contains alias </Button>
          <Button onPress={() => this._aliases()}>Aliases </Button>
          <Button onPress={() => this._size()}>Size </Button>
          <Button onPress={() => this._deleteStore()}>Delete store </Button>

        </Content>
      </Container>
    )
  }
}
