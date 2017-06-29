/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Routes from '../../Routes'
import Logger from '../../Logger'
import Session from '../../Session'
import Touchable from '../../Components/Touchable'
import ConsentUser from '../../Models/ConsentUser'

import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Row,
  Col,
  Spinner
} from 'native-base'

import BackButton from '../../Components/BackButton'

export default class SplashScreen extends Scene {

  constructor(props) {
    super(props)
    this.pushedRoute = false
    this.state = {
      tokenAvailable: true,
      ready: false
    }
    StatusBar.setHidden(true)
  }

  _readyUp() {
    // Delay things so it doesn't look weird
    setTimeout(() => {
      this.setState({
        ready: true
      }, () => {
        const userState = Session.getState().user
        if (userState && userState.registered) {
          this.navigator.push({
            ...Routes.authenticationPrompt,
            auth_success_action: Promise.resolve,
            auth_success_destination: Routes.main
          })
        }
      })
    }, 1000)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.booted && !this.pushedRoute) {
      this.pushedRoute = true
      this._readyUp()
    }
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
          Logger.info('False start. No App token', this.filename)
          alert('False start. No App token. Please reinstall Lifekey')
          setTimeout(() => {
            throw new Error('Please reinstall Lifekey')
          }, 6000)
        }
      })
      .catch(error => {
        this.setState({
          tokenAvailable: false
        })
        Logger.info('False start. No App token', this.filename)
        alert('False start. No App token. Please reinstall Lifekey')
      })
    }, 1000)

  }

  render() {
    const scan = (
      <Touchable
        onPress={() => this.navigator.push(Routes.camera.qrCodeScanner)}
      >
        <View style={style.buttonView} >
          <Text style={[style.buttonText]}>Scan</Text>
        </View>
      </Touchable>
    )

    const start = (
      <Touchable
        onPress={() => this.navigator.push(Routes.onboarding.register)}
      >
        <View style={style.buttonView} >
          <Text style={[style.buttonText]}>{ this.state.ready ? 'Let\'s start' : '' }</Text>
        </View>
      </Touchable>
    )

    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} onPress={() => false} />
          <StatusBar hidden={true} />
          <Grid>
            <Col style={{ flex: 1, height: Dimensions.get('window').height }}>

                <Row
                  style={[style.firstRow, { backgroundColor: this.state.tokenAvailable ? null : 'red' }]}
                >
                  <Touchable
                    style={{ flex: 1 }}
                    delayLongPress={500}
                    onLongPress={() => this.navigator.push(Routes.debug.main)}
                  >
                    <Image
                      style={{ width: 150, height: 150 }}
                      source={require('../../../App/Images/logo_big.png')}
                    />
                  </Touchable>
                </Row>


              <Row style={[style.secondRow]}>
                <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <View style={{ flex: 1, padding: 20, paddingTop: 40, paddingBottom: 40 }}>
                    
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 2 }}>
                      { !this.state.ready && <Spinner color="blue"/> }
                      <Text style={{ fontSize: 20, textAlign: 'center' }}>Securely store and verify personal information.</Text>
                    </View>

                  </View>
                </Row>
              </Row>
              <Row style={[style.thirdRow]}>
                {this.state.ready ?
                  <Text>Trusted Partner Logos</Text>
                  :
                  <Text>Connecting to Consent...</Text>
                }
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
    flex: 10,
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
    flex: 5,
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
