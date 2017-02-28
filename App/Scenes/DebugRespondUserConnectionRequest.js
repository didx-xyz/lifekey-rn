/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Crypto from '../Crypto'
// import PushNotifications from '../PushNotifications'
import Session from '../Session'
import Storage from '../Storage'
import Logger from '../Logger'
import Config from '../Config'
import DebugViewConnections from './DebugViewConnections'

import {
  Text,
  View,
  // NativeModules
} from 'react-native'

import {
  Container,
  Content,
  Button
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'

export default class DebugRespondUserConnectionRequest extends Scene {

  constructor(props) {
    super(props)
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  _doRespond(ucr_id, body) {
    var toSign = Date.now().toString()
    Crypto.loadKeyStore(
      'consent', Session.getState().userPassword
    ).then(name => {
      return Crypto.sign(
        toSign,
        "private_lifekey",
        Session.getState().userPassword,
        Crypto.SIG_SHA256_WITH_RSA
      )
    }).then(signature => {
      return fetch(`${Config.http.baseUrl}/management/connection/${ucr_id}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
          'x-cnsnt-id': Session.getState().dbUserId,
          'x-cnsnt-plain': toSign,
          'x-cnsnt-signed': signature.trim()
        }
      })
    }).then(r => {
      return r.json()
    }).then(res => {
      if (res.error) alert(res.message)
      var session = Session.getState()
      session.connections.user_connection_requests[ucr_id].responded = true
      Session.update(session)
      return Storage.store(Config.storage.dbKey, session)
    }).then(_ => {
      this.navigator.pop()
    }).catch(alert)
  }

  _reject(ucr_id) {
    this._doRespond(ucr_id, {accepted: false})
  }

  _accept(ucr_id) {
    this._doRespond(ucr_id, {accepted: true})
  }
  
  render() {
    return (
        <Container>
            <Content>
                <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
                <Text>You received a connection request from {this.props.passProps.nickname}</Text>
                <Button onPress={this._reject.bind(this, this.props.passProps.id)}>
                    <Text>Reject</Text>
                </Button>
                <Button onPress={this._accept.bind(this, this.props.passProps.id)}>
                    <Text>Accept</Text>
                </Button>
            </Content>
        </Container>
    )
  }
}