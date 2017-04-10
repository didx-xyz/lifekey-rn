/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za> et al.
 */

import React from 'react'
import Scene from '../../Scene'
import Config from '../../Config'
// import { Container, Content, List, ListItem, Text, H4, Body } from 'native-base'
import {
  List,
  ListItem,
  Body,
  Text,
  Container,
  Content
} from 'native-base'

class DebugConfiguration extends Scene {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <Container>
        <Content>
          <List>
            {Object.keys(Config).map((value, index, array) => {
              const settingName = value
              const settingValue = JSON.stringify(Config[value])
              return (
                <ListItem key={index}>
                  <Body>
                    <Text>{settingName}</Text>
                    <Text style={{ color: '#888888' }}>{settingValue}</Text>
                  </Body>
              </ListItem>
              )
            })}
          </List>
        </Content>
      </Container>)
  }
}

export default DebugConfiguration
