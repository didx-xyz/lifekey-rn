/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Config from '../Config'
import Session from '../Session'

import {
  Text,
  View
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'
import QRCode from 'react-native-qrcode'

export default class DebugShowQRCode extends Scene {

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  render() {
    const state = Session.getState()
    const data = `${Config.http.baseUrl}/profile/${state.dbUserId}`

    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <QRCode
              value={data}
              size={200}
              bgColor="purple"
              fgColor="white"
            />
          </View>
        </Content>
      </Container>
    )
  }
}
