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
import AndroidBackButton from 'react-native-android-back-button'

export default class DebugViewConnectionRequests extends Scene {

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <Text>Hello World</Text>
        </Content>
      </Container>
    )
  }
}
