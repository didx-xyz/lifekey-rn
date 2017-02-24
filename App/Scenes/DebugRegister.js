/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Crypto from '../Crypto'
import PushNotifications from '../PushNotifications'
import Session from '../Session'
import Storage from '../Storage'
import Logger from '../Logger'
import Config from '../Config'
import Firebase from '../Firebase'
import Api from '../Api'

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

  componentDidMount() {
    super.componentDidMount()
    if (Session.getState().userRegistered) {
      this.setState({
        registered: true
      })
    }
  }

  register() {
    if (!this.state.email.trim() || !this.state.nickname.trim() || !this.state.password.trim()) {
      alert("Please fill in all fields")
      return
    }
    const email = this.state.email.trim()
    const nickname = this.state.nickname.trim()
    const password = this.state.password.trim()

    Logger.info("registering as " +
                email + ", " +
                nickname + ", " + password,
                this._fileName)

    var pemKey, firebaseToken
    const toSign = Date.now().toString()

    Crypto.getKeyStoreList()
    .then(list => {
      if (list.find(x => x === "consent")) {
        throw "Already registered"
      } else {
        return Crypto.createKeyStore("consent", password)
      }
    })
    .then(() => Crypto.addKeyPair(
      Crypto.KEYPAIR_RSA,
      "_lifekey",
      2048,
      password,
      "rsa-example.pem"
    ))
    .then(keys => Crypto.getKeyAsPem("public_lifekey", password))
    .then(pem => {
      pemKey = pem
      return Firebase.getToken()
    })

    .then(_firebaseToken => {
      firebaseToken = _firebaseToken
      return Crypto.sign(toSign, "private_lifekey", password, Crypto.SIG_SHA256_WITH_RSA)})
    .then(signature => Api.register({
      email: email,
      nickname: nickname,
      device_id: firebaseToken,
      device_platform: "android",
      public_key_algorithm: "rsa",
      public_key: pemKey,
      plaintext_proof: toSign,
      signed_proof: signature
    }))
    .then(responseJson => {
      console.log(responseJson)
      alert(JSON.stringify(responseJson))
      Session.update({
        dbUserId: responseJson.id
      })
    })
    .catch(error => {
      alert(error)
      console.log(error)
    })
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
