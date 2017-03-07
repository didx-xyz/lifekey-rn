/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Routes from '../../Routes'
import Palette from '../../Palette'

import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableNativeFeedback
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Row,
  Col
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'

export default class SplashScreen extends Scene {

  _hardwareBackHandler() {
    return false // exit the app
  }

  _onAttention() {
    StatusBar.setHidden(true)
  }

  componentWillMount() {
    super.componentWillMount()
    this._onAttention()
  }

  componentWillFocus() {
    super.componentWillFocus()
    this._onAttention()

  }

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />

          <Grid>
            <Col style={{ flex: 1, height: this.props.screenHeight }}>
              <Row style={[style.firstRow]}>
                <Text>Splash Page</Text>
              </Row>
              <Row style={[style.secondRow]}>
                <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <View style={{ flex: 1, padding: 20, paddingTop: 40, paddingBottom: 40 }}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 2 }}>
                      <Text style={{ fontSize: 20, textAlign: 'center' }}>Securely store and verify personal information.</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', paddingTop: 2 }}>
                      <Text style={{ fontSize: 16 }}>Carousel between 3 opening lines</Text>
                    </View>
                  </View>
                </Row>
              </Row>
              <Row style={[style.thirdRow]}>
                <Text>Trusted Partner Logos</Text>
              </Row>
              <Row style={[style.trustedPartnersRow]}>
                <Col>
                  <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(Palette.consentGrayLight, true)}
                    onPress={() => this.navigator.push(Routes.camera.qrCodeScanner)}
                    delayPressIn={0}
                  >
                    <View style={style.buttonView} >
                      <Text style={[style.buttonText]}>Scan</Text>
                    </View>
                  </TouchableNativeFeedback>
                </Col>
                <Col>
                  <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(Palette.consentGrayLight, true)}
                    onPress={() => this.navigator.push(Routes.onboarding.register)}
                    delayPressIn={0}
                  >
                    <View style={style.buttonView} >
                      <Text style={[style.buttonText]}>Let's start</Text>
                    </View>
                  </TouchableNativeFeedback>
                </Col>
              </Row>
            </Col>
          </Grid>

        </Content>
      </Container>
    )
  }
}

const style = StyleSheet.create({
  firstRow: {
    backgroundColor: 'white',
    flex: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondRow: {
    backgroundColor: '#F5F6F6',
    flex: 12,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  thirdRow: {
    backgroundColor: '#ECEEEE',
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trustedPartnersRow: {
    backgroundColor: '#216BFF',
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  }
})
