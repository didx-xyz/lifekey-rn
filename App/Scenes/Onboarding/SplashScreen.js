/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'

import {
  Text,
  View,
  Dimensions,
  StyleSheet,
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

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />

          <Grid>
            <Col style={{ height: this.props.screenHeight }}>
              <Row style={[style.firstRow]}>
                <Text>Splash Page</Text>
              </Row>
              <Row style={[style.secondRow]}>
                <Row style={{ alignItems: 'center' }}>
                  <Text>Securely store and verify personal information.</Text>
                </Row>
                <Row style={{ alignItems: 'center' }}>
                  <Text>{this.props.screenHeight}</Text>
                </Row>
              </Row>
              <Row style={[style.thirdRow]}>
                <Text>Trusted Partner Logos</Text>
              </Row>
              <Row style={[style.fourthRow]}>
                <Col>
                  <TouchableNativeFeedback onPress={() => ({})}>
                    <View style={style.buttonView} >
                      <Text style={[style.buttonText]}>Scan</Text>
                    </View>
                  </TouchableNativeFeedback>
                </Col>
                <Col>
                  <TouchableNativeFeedback onPress={() => ({})}>
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
  fourthRow: {
    backgroundColor: '#216BFF',
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white'
  }
})

/*
210px = 2.7 = 6
215 = 2.7 = 6
65 = 8.9 = 18
90 = 6.4 = 12
*/

// total: 580