/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import PushNotifications from '../PushNotifications'
import Logger from '../Logger'
import Config from '../Config'
import Firebase from '../Firebase'

import {
  Text,
  View,
} from 'react-native'
import { Button, H2 } from 'nachos-ui'

import {
  Container,
  Content
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'

export default class DebugPushNotification extends Scene {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  componentDidMount() {
    super.componentDidMount()

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
            <H2>Debug Firebase and PN</H2>
          </View>

          <Button style={[styles.btn]} kind="squared" onPress={ () => this._getToken()}>Get Token</Button>
          <Button style={[styles.btn]} kind="squared" onPress={ () => this._getMessages()}>Get Messages</Button>
          <Button style={[styles.btn]} kind="squared" onPress={ () => this._getMessage(1)}>Get First Message</Button>
          <Button style={[styles.btn]} kind="squared" onPress={ () => this._getMessagesLength()}>Get Number of Messages</Button>

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
