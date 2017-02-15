/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Crypto from '../Crypto'

import {
  Text,
  NativeModules
} from 'react-native'

import {
  Container,
  Content,
  Button
} from 'native-base'

export default class ApiTest extends Scene {

  _createKeyStore() {
    Crypto.loadKeyStore("testing123", "testing123")
    .then(() => {
      return Crypto.addKeyPair(Crypto.KEYPAIR_RSA, "SOME-KEY", 2048, "testing123", "rsa-example.pem")

    })
    .then(r => {
      alert("Done")
    })
    .catch(e => alert(e))
  }

  _register() {
    var pemKey
    var toSign = Date.now().toString()

    Crypto.loadKeyStore("testing123", "testing123")
    .then(() => Crypto.getKeyAsPem("publicSOME-KEY", "testing123")
    ).then((pk) => {
      pemKey = pk
      alert(pemKey)
      // return Crypto.digest(toSign, Crypto.DIGEST_SHA_256)
      return toSign
    }).then((hash) => Crypto.sign(hash, "privateSOME-KEY", "testing123", Crypto.SIG_SHA256_WITH_RSA))
      .then((signature) => fetch('http://staging.api.lifekey.cnsnt.io/management/register', {
        body: JSON.stringify({
          email: "werner@io.co.za",
          nickname: "PanzerPlanet",
          device_id: 234,
          device_platform: "android",
          public_key_algorithm: "rsa",
          public_key: pemKey,
          plaintext_proof: toSign.trim(),
          signed_proof: signature.trim()
        }),
        method: 'POST',
        headers: {
          "content-type": "application/json"
        }
      }))
      .then(r => r.json()).then(console.log).catch(console.log)
      .catch(e => alert(e))

  }

  render() {
    return (
      <Container>
        <Content>
          <Button onPress={ () => this._register()}>Register</Button>
          <Button onPress={ () => this._createKeyStore()}>Create Key</Button>
        </Content>
      </Container>
    )
  }
}
