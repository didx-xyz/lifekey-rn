/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Routes from '../../Routes'
import Config from '../../Config'
import Logger from '../../Logger'
import Touchable from '../../Components/Touchable'
import ConsentUser from '../../Models/ConsentUser'

import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Row,
  Col
} from 'native-base'

import BackButton from '../../Components/BackButton'

export default class SplashScreen extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      tokenAvailable: true
    }
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

  componentDidMount() {
    super.componentDidFocus()
    // Give the token a fighting chance man
    setTimeout(() => {
      ConsentUser.getToken()
      .then(result => {
        if (result) {
          this.setState({
            tokenAvailable: true
          })
        } else {
          this.setState({
            tokenAvailable: false
          })
          Logger.info('False start. No App token', this._fileName)
          alert('False start. No App token. Please reinstall Lifekey')
          // throw 'False start'
        }
      })
      .catch(error => {
        this.setState({
          tokenAvailable: false
        })
        Logger.info('False start. No App token', this._fileName)
        alert('False start. No App token. Please reinstall Lifekey')
      })
    }, 1000)

  }

  render() {
    let scan = (
      <Touchable
        onPress={() => this.navigator.push(Routes.camera.qrCodeScanner)}
      >
        <View style={style.buttonView} >
          <Text style={[style.buttonText]}>Scan</Text>
        </View>
      </Touchable>
    )

    let start = (
      <Touchable
        onPress={() => this.navigator.push(Routes.onboarding.register)}
      >
        <View style={style.buttonView} >
          <Text style={[style.buttonText]}>Let's start</Text>
        </View>
      </Touchable>
    )

    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} onPress={() => false} />
          <Grid>
            <Col style={{ flex: 1, height: this.props.screenHeight }}>
              { Config.DEBUG ?
                <Touchable style={{ flex: 1 }} delayLongPress={500} onLongPress={() => this.navigator.push(Routes.debug.main)}>
                  <Row style={[style.firstRow, { backgroundColor: this.state.tokenAvailable ? null : 'red' }]}>
                    {/* <Text>Splash Page</Text> */}
                      <Image style={{ width: 150, height: 150 }} source={require('../../../App/Images/consent_logo.png')}/>
                  </Row>
                </Touchable>
                :
                <Row style={[style.firstRow]}>
                  <Text>Splash Page</Text>
                </Row>
              }


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
              <Row style={[style.buttonsRow]}>
                <Col>
                  {scan}
                </Col>
                <Col>
                  {start}
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
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondRow: {
    backgroundColor: '#F5F6F6',
    flex: 11,
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
  buttonsRow: {
    backgroundColor: '#216BFF',
    flex: 7,
    alignItems: 'center',
    justifyContent: 'center'
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
