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
    const email = this.state.email.trim()
    const nickname = this.state.nickname.trim()
    const password = this.state.password.trim()
    if (!email || !nickname || !password) {
      alert("Please fill in all fields")
      return
    }

    Logger.info("registering as " +
                email + ", " +
                nickname + ", " + password,
                this._fileName)

    var pemKey, firebaseToken, jsonData
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
      return _firebaseToken ? (
        Promise.all([
          _firebaseToken,
          Session.update({firebaseToken: _firebaseToken}),
          Storage.store(Config.storage.dbKey, {firebaseToken: _firebaseToken})
        ])
      ) : Promise.all([Session.getState().firebaseToken])
    })
    .then(values => {
      firebaseToken = values[0]
      return Promise.resolve()
    })
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
      jsonData = responseJson.body
      return Storage.store(Config.storage.dbKey, {
        dbUserId: jsonData.id
      })
    })
    .then(() => {
      return Session.update({
        dbUserId: jsonData.id,
        userPassword: password // Not ideal
      })
    })
    .then(() => {
      this.navigator.pop()
    })
    .catch(error => {
      // alert(error)
      Logger.error(error, this._fileName)
      this.navigator.pop()
    })
  }

  login() {
    alert("todo")
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

          { this.state.registered ?
          <Button style={[styles.btn]} kind="squared" onPress={ () => this.login()}>Login</Button>
          :
          <Button style={[styles.btn]} kind="squared" onPress={ () => this.register()}>Register</Button>
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
