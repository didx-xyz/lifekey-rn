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

export default class Blank extends Scene {

  render() {
    return (
      <Container>
        <Content>
          <Text>Hello World</Text>
        </Content>
      </Container>
    )
  }
}
