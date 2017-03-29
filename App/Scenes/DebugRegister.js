/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import ConsentUser from '../Models/ConsentUser'
import Logger from '../Logger'

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
    ConsentUser.isRegistered()
    .then(registered => this.setState({ registered }))
  }

  register() {
    const email = this.state.email.trim()
    const nickname = this.state.nickname.trim()
    const password = this.state.password.trim()
    ConsentUser.register(nickname, email, password)
    .then(result => {
      Logger.info("REGISTERED", 'DebugRegister')
      this.setState({
        registered: true
      })
    })
    .catch(error => {
      Logger.error("Not so much registered", 'DebugRegister', error)
    })

  }

  login() {
    alert("todo")
  }

  unregister() {
    ConsentUser.unregister()
    .then(result => {
      alert(JSON.stringify(result))
    })
    .catch(error => {
      Logger.error('Could not unregister', this._fileName, error)
    })
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
          <View style={{ flex: 1 }}>
            <Button style={[styles.btn]} kind="squared" onPress={ () => this.login()}>Login</Button>
            <Button style={[styles.btn]} kind="squared" onPress={ () => this.unregister()}>Unregister</Button>
          </View>
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
