/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Crypto from '../Crypto'
import PushNotifications from '../PushNotifications'

import {
  Text,
  View,
  NativeModules
} from 'react-native'
import { Button, Input, H1, H3 } from 'nachos-ui'

import {
  Container,
  Content
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'

export default class DebugRegister extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      nickname: '',
      password: '',
      keystoreLoaded: false,
      registered: false
    }
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  _consentKeystoreExists() {
    Crypto.getKeyStoreList()
    .then(list => {
      if (list.find(x => x === "consent")) {
        this.setState({
          registered: true
        })
      }
    })
    .catch(error => alert(error))
  }

  componentDidMount() {
    this._consentKeystoreExists()
  }

  register() {
    if (!this.state.email || !this.state.nickname || !this.state.password) {
      alert("Please fill in all fields")
      return
    }

    var pemKey
    const toSign = Date.now().toString()
    Crypto.getKeyStoreList()
    .then(list => {
      if (list.find(x => x === "consent")) {
        throw "Already registered"
      } else {
        return Crypto.createKeyStore("consent", this.state.password)
      }
    })
    .then(() => Crypto.addKeyPair(
      Crypto.KEYPAIR_RSA,
      "_lifekey",
      2048,
      this.state.password,
      "rsa-example.pem"
    ))
    .then(keys => Crypto.getKeyAsPem("public_lifekey", this.state.password))
    .then(pem => {
      pemKey = pem
      return toSign
    })
    .then(toSign => Crypto.sign(toSign, "private_lifekey", this.state.password, Crypto.SIG_SHA256_WITH_RSA))
    .then(signature => fetch("http://staging.api.lifekey.cnsnt.io/management/register", {
      body: JSON.stringify({
        email: this.state.email.trim(),
        nickname: this.state.nickname.trim(),
        device_id: 234,
        device_platform: "android",
        public_key_algorithm: "rsa",
        public_key: pemKey,
        plaintext_proof: toSign.trim(),
        signed_proof: signature.trim()
      }),
      method: "POST",
      headers: {
        "content-type": "application/json"
      }
    }))
    .then(response => {
      console.log(response)
      alert(JSON.stringify(response))
    })
    .catch(error => alert("Already registered?", error))
  }

  login() {
    alert("todo")
  }

  _getToken() {
    PushNotifications.getToken().then(
      console.log
    ).catch(
      console.log
    )
  }

  _getMessages() {
    PushNotifications.getMessages().then(
      console.log
    ).catch(
      console.log
    )
  }

  _getMessage(index) {
    PushNotifications.getMessage(index).then(
      console.log
    ).catch(
      console.log
    )
  }

  _getMessagesLength() {
    PushNotifications.getMessagesLength().then(
      console.log
    ).catch(
      console.log
    )
  }

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <View style={{ alignItems: 'center' }}>
            <H1>Register on Consent</H1>
          </View>
          <H3>Enter your details to register</H3>
          <Text>Status: {this.state.registered ? "Registered" : "Not Registered"}</Text>
          { this.state.registered ? null :
          <Input
            placeholder="Email"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          /> }
          { this.state.registered ? null :
          <Input
            placeholder="Nickname"
            value={this.state.nickname}
            onChangeText={nickname => this.setState({ nickname })}
          /> }
          <Input
            placeholder="Password"
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          <Button style={[styles.btn]} onPress={ () => this._getToken()}>Get Token</Button>
          <Button style={[styles.btn]} onPress={ () => this._getMessages()}>Get Messages</Button>
          <Button style={[styles.btn]} onPress={ () => this._getMessage(1)}>Get First Message</Button>
          <Button style={[styles.btn]} onPress={ () => this._getMessagesLength()}>Get Number of Messages</Button>
          
          { this.state.registered ?
          <Button style={[styles.btn]} onPress={ () => this.login()}>Login</Button>
          :
          <Button style={[styles.btn]} onPress={ () => this.register()}>Register</Button>
          }
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
