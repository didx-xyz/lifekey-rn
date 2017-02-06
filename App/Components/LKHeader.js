import React, { Component } from 'react'
import { View } from 'react-native'
import { Header, Title, Icon, Button } from 'native-base'

export default class LKHeader extends Component {
  render() {
    return (
      <Header>
        <Button transparent>
          <Icon name="ios-arrow-back"/>
        </Button>
        <Title>Lifekey</Title>
        <Button transparent>
          <Icon name="ios-menu"/>
        </Button>
      </Header>
    )
  }
}
