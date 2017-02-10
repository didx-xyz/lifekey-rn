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
    NativeModules.Keystore.addKeyPair("RSA", "SOME-KEY", "testing123", "rsa-example.pem")
    .then((keypair) => {
      alert(JSON.stringify(keypair))
      console.log(JSON.stringify(keypair))
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

  _sign() {
    NativeModules.Keystore.sign("Some data to sign here", "privateSOME-KEY", "testing123", "SHA256withRSA")
    .then(x => {
      alert(x)
      console.log(x)
    })
    .catch(e => alert(e))
  }

  _getFormat() {
    NativeModules.Keystore.getKeyAsPem("privateSOME-KEY", "testing123")
    .then(x => {
      console.log(x)
      const fd = new FormData()
      fd.append("plaintext", "hex sha256 hash")
      fd.append("signature", "the sig hex")
      fd.append("public_key", "pem encoded")
      let details = {}
      return fetch("http://172.16.20.118:8000/rsa-verify", { method: 'POST', body: JSON.stringify(details) })
    })
    .then(x => {
      alert(JSON.stringify(x))
      console.log(JSON.stringify(x))
    })
    .catch(x => alert(x))
  }

  _parityCheck() {

    var mydigest
    var mysignature

    const data = "Some data to sign here"
    NativeModules.Keystore.load(
      "testing123", "testing123"
    ).then(_ => {
      return NativeModules.Keystore.digest(data, "SHA256")
    }).then((digest) => {
      mydigest = digest
      return NativeModules.Keystore.sign(digest, "privateSOME-KEY", "testing123", "SHA256withRSA")
    }).then((signature) => {
      mysignature = signature
      return NativeModules.Keystore.getKeyAsPem("publicSOME-KEY", "testing123")
    }).then(pemKey => {
      console.log(data, mysignature, pemKey)
      return fetch("http://172.16.20.118:8000/rsa-verify2", {
        method: 'POST',
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({
          plaintext: data,
          signature: mysignature,
          public_key: pemKey
        })
      })
    }).then(r => {
      console.log(JSON.stringify(r))
    }).catch(console.log)
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
          <Button onPress={() => this._sign()}>Sign </Button>
          <Button onPress={() => this._parityCheck()}>Parity check </Button>


        </Content>
      </Container>
    )
  }
}
