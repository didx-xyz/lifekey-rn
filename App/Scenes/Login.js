/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Routes from '../Routes'
import Session from '../Session'
import Config from '../Config'
import Palette from '../Palette'

import {
  View,
  Image,
  StyleSheet,
  Text
} from 'react-native'

import {
  InputGroup,
  Input,
  Container,
  Content,
  Button,
  Icon,
  Footer
} from 'native-base'

const mockUser = {
  userId: 1,
  userToken: 'tokengoeshere'
}

const mockPdr = [
  {
    section: "identity",
    data: {
      firstName: "Werner",
      lastName: "Roets"
    }
  },
  {
    section: "absa",
    data: {
      accNumber: "2324324234",
      address: "1 Main street, Cape Town"
    }
  }
]

export default class Login extends Scene {

  login() {
    Session.update({
      userData: mockUser,
      pdrData: mockPdr
    })
    this.navigator.push(Routes.main)
  }

  goToRegister() {
    this.navigator.push(Routes.register)
  }

  render() {
    return (
      <Container>
        <Content>
          <View style={ss.outerView}>
            <Image resizeMode="contain" style={{ height: 225 }} source={require('../Images/consent_logo.png')}/>
            <InputGroup>
              <Icon name="ios-person"/>
              <Input label="Username" placeholder="Username"/>
            </InputGroup>
            <InputGroup>
              <Icon name="ios-unlock"/>
              <Input label="Password" placeholder="Password"/>
            </InputGroup>
            <View style={ss.buttonWrapperView}>
              <Button block onPress={() => this.login()}>Login</Button>
              <View style={ss.buttonSeperatorView}>
                <Text>or</Text>
              </View>
              <Button block onPress={() => this.goToRegister()}>Register</Button>
            </View>
          </View>
        </Content>

        <Footer style={ss.footer}>
          <Text style={ss.footerText}>Lifekey {Config.version}</Text>
        </Footer>

      </Container>
    )
  }
}

const ss = StyleSheet.create({
  outerView: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    alignItems: 'center'
  },
  buttonWrapperView: {
    width: 200,
    marginTop: 10
  },
  buttonSeperatorView: {
    height: 20,
    alignItems: 'center'
  },
  footer: {
    backgroundColor: Palette.consentBlue,
    alignItems: 'center'
  },
  footerText: {
    fontWeight: 'bold'
  }
})
