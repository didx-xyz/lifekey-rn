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
  View,
  Image
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'

var url

export default class DebugShowQRCode extends Scene {

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  render() {
    const state = Session.getState()
    const data = `${Config.http.baseUrl}/demo/qr/${state.dbDid}`

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
            <Image style={{width: 250, height: 250}}
                   source={{uri: data}} />
          </View>
        </Content>
      </Container>
    )
  }
}
