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
import Design from '../../DesignParameters'
import Palette from '../../Palette'

export default class SplashScreen extends Scene {

  constructor(props) {
    super(props)
    this.pushedRoute = false
    this.state = {
      tokenAvailable: true,
      ready: true
    }
    StatusBar.setHidden(true)
  }

  _readyUp() {
    setTimeout(() => {
      this.setState({
        ready: true
      }, () => {
        const userState = Session.getState().user

        console.log("SESSIONSTATE: ", Session.getState())

        if (userState && userState.registered) {
          this.navigator.push({
            ...Routes.authenticationPrompt,
            auth_success_action: Promise.resolve,
            auth_success_destination: Routes.main
          })
        }
      })
    }, 1000) // This works with 0, but doesn't work without the settimeout. Smells fishy... 
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.booted && !this.pushedRoute) {
      this.pushedRoute = true
      this._readyUp()
    }
  }

  componentDidMount() {
    super.componentDidFocus()
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

    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} onPress={() => false} />
          <StatusBar hidden={true} />
          <Grid>
            <Col style={style.body}>

              <Row style={[style.firstRow, { backgroundColor: this.state.tokenAvailable ? null : 'red' }]}>
                <Touchable style={{ flex: 1 }} delayLongPress={500} onLongPress={() => this.navigator.push(Routes.debug.main)} >
                  <Image style={{ width: 150, height: 150 }} source={require('../../../App/Images/logo_big.png')} />
                </Touchable>
              </Row>

              <Row style={[style.secondRow]}>
                <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 2 }}>
                  <Text style={{ fontSize: 20, textAlign: 'center' }}>Securely store and verify personal information.</Text>
                </View>
              </Row>
              <Row style={[style.thirdRow]}>
                {this.state.ready ?
                  <Text>Trusted Partner Logos</Text>
                  :
                  <Text>Connecting to Consent...</Text>
                }
              </Row>
              
            </Col>
            <Row style={[style.footer]}>
              <Col>

                { 
                  this.state.ready ?
                    <Touchable onPress={() => this.navigator.push(Routes.onboarding.register)}>
                      <View style={style.buttonView} >
                        <Text style={[style.buttonText]}>{ this.state.ready ? 'Let\'s start' : '' }</Text>
                      </View>
                    </Touchable>
                  :
                    <Spinner color={ Palette.consentOffWhite }/>
                }

              </Col>
            </Row>
          </Grid>

        </Content>
      </Container>
    )
  }
}

const style = StyleSheet.create({
  body:{
    flex: 1, 
    height: Dimensions.get('window').height - Design.footer.height 
  },
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
  footer: {
    backgroundColor: '#216BFF',
    // flex: 5,
    height: Design.footer.height,
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
