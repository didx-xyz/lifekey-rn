/**
 * Lifekey App
 * @copyright 2016 - 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'

import {
  Text
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'

import BackButton from '../../Components/BackButton'

export default class SetPin extends Scene {
  render() {
    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <Text>Hello World</Text>
        </Content>
      </Container>
    )
  }
}
