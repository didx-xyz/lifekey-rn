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
  Dimensions,
  NativeModules,
  NetInfo
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
    this.first = true
    this.state = {
      tokenAvailable: true,
      ready: false
    }
  }

  reset_firebase_token() {
    NativeModules.FirebaseReset.new_token().then(token => {
      this.setState({ready: true, tokenAvailable: true})
    }).catch(err => {
      // this is fatal, crash the app
      throw err
    })
  }

  net_info_change_listener(changed) {
    if (!changed) return
    NetInfo.removeEventListener('change', this.net_info_change_listener)
    this.reset_firebase_token()
  }

  componentDidMount() {
    super.componentDidFocus()

    if (!this.first) return
    
    this.first = false
    StatusBar.setHidden(true)

    // FIXME
    // session.getstate might not be of type "object"
    var user = Session.getState().user
    if (user && user.registered) {
      this.navigator.push(Routes.onboarding.unlock)
      return
    }

    Promise.all([
      NetInfo.isConnected.fetch(),
      NetInfo.isConnectionExpensive(),
      ConsentUser.getToken()
    ]).then(res => {
      var [connected, expensive, token] = res
      if (!connected) {
        alert('You will not be able to register without an Internet connection')
        NetInfo.addEventListener('change', this.net_info_change_listener.bind(this))
      } else if (!token && connected) {
        this.reset_firebase_token()
      } else {
        this.setState({ready: true, tokenAvailable: true})
      }
    })
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'change',
      this.net_info_change_listener.bind(this)
    )
  }

  render() {

    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} onPress={() => false} />
          <StatusBar hidden={true} />
          <Grid>
            <Col style={{ flex: 1, height: Dimensions.get('window').height }}>

                <Row style={[style.firstRow, { backgroundColor: this.state.tokenAvailable ? null : 'red' }]}>
                  <Touchable style={{ flex: 1 }}>
                             {/*delayLongPress={500}
                             onLongPress={() => this.navigator.push(Routes.debug.main)}>*/}
                    <Image style={{ width: 150, height: 150 }}
                           source={require('../../../App/Images/logo_big.png')} />
                  </Touchable>
                </Row>

              <Row style={[style.secondRow]}>
                <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <View style={{ flex: 1, padding: 20, paddingTop: 40, paddingBottom: 40 }}>
                    
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 2 }}>
                      {!this.state.ready && <Spinner color="blue"/>}
                      <Text style={{ fontSize: 20, textAlign: 'center' }}>Securely store and verify personal information.</Text>
                    </View>

                  </View>
                </Row>
              </Row>
              <Row style={[style.thirdRow]}>
                <Text>Trusted Partner Logos</Text>
              </Row>
              <Row style={[style.buttonsRow]}>
                <Col>
                  <Touchable onPress={this.state.ready ? () => this.navigator.push(Routes.camera.qrCodeScanner) : function() {}}>
                    <View style={style.buttonView} >
                      <Text style={[style.buttonText]}>{this.state.ready ? 'Scan' : ''}</Text>
                    </View>
                  </Touchable>
                </Col>
                <Col>
                  <Touchable onPress={this.state.ready ? () => this.navigator.push(Routes.onboarding.register) : function() {}}>
                    <View style={style.buttonView} >
                      <Text style={[style.buttonText]}>{this.state.ready ? 'Continue' : 'Loading'}</Text>
                    </View>
                  </Touchable>
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
