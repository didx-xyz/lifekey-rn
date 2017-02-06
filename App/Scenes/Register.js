/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Config from '../Config'

import {
  Text,
  View,
  StyleSheet
} from 'react-native'
import {
  Container,
  Content,
  Header,
  Button,
  Icon,
  Title,
  InputGroup,
  Input
} from 'native-base'


export default class Register extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: ""
    }
  }

  register() {
    const formData = new FormData()
    formData.append('email', this.state.email)
    formData.append('password', this.state.password)
    fetch('url', {
      method: 'POST',
      body: formData,
      headers: ['']
    })

    .then((response) => {
      alert(JSON.stringify(response))
    })

    .catch((err) => {
      console.log(err)
    })
  }

  render() {
    return (
      <Container>
        <Header>
          <Button transparent onPress={() => this.navigator.pop()}>
            <Icon name="ios-arrow-back"/>
          </Button>
          <Title>{this.props.route.title}</Title>
          <Button transparent>
            <Icon name="ios-menu"/>
          </Button>
        </Header>

        <Content>
        <InputGroup borderType="regular" >
          <Input placeholder="Email" onChangeText={text => this.setState({ email: text })} />
        </InputGroup>
        <InputGroup borderType="regular" >
          <Input placeholder="Password" onChangeText={text => this.setState({ password: text })} />
        </InputGroup>
        <View style={ss.buttonView}>
          <Button onPress={(() => this.register())}>Register</Button>
        </View>
        </Content>
      </Container>
    )
  }
}

const ss = StyleSheet.create({
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 5
  }
})
