/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Crypto from '../Crypto'
import Session from '../Session'
import Storage from '../Storage'
import ConsentUser from '../Models/ConsentUser'
import Logger from '../Logger'
import Config from '../Config'
import Firebase from '../Firebase'
import Api from '../Api'

import {
  Text,
  View
} from 'react-native'
import { Button, Input, H1, H3 } from 'nachos-ui'

import {
  Container,
  Content
} from 'native-base'

import BackButton from '../Components/BackButton'

export default class DebugRegister extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      nickname: '',
      password: '',
      keystoreLoaded: false,
      registered: false
    }
  }

  componentDidMount() {
    super.componentDidMount()
    if (Session.getState().userRegistered) {
      this.setState({
        registered: true
      })
    }
  }

  register() {
    const email = this.state.email.trim()
    const nickname = this.state.nickname.trim()
    const password = this.state.password.trim()
    ConsentUser.register(nickname, email, password)
    .then(() => {
      Logger.info("REGISTERED", 'DebugRegister')
    })
    .catch(error => {
      Logger.error("REGISTERED", 'DebugRegister', error)
    })

  }

  login() {
    alert("todo")
  }

  render() {
    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <View style={{ alignItems: 'center' }}>
            <H1>Register on Consent</H1>
          </View>
          <H3>Enter your details to register</H3>
          <Text>Status: {this.state.registered ? "Registered" : "Not Registered"}</Text>
          { this.state.registered ? null :
          <Input
            placeholder="Email"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          /> }
          { this.state.registered ? null :
          <Input
            placeholder="Nickname"
            value={this.state.nickname}
            onChangeText={nickname => this.setState({ nickname })}
          /> }
          <Input
            placeholder="PIN"
            value={this.state.password}
            keyboardType={'numeric'}
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
          />

          { this.state.registered ?
          <Button style={[styles.btn]} kind="squared" onPress={ () => this.login()}>Login</Button>
          :
          <Button style={[styles.btn]} kind="squared" onPress={ () => this.register()}>Register</Button>
          }
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
