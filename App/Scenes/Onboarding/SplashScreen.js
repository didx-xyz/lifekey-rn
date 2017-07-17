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
import LifekeyFooter from '../../Components/LifekeyFooter'

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
      ready: false
    }
    StatusBar.setHidden(true)
  }

  initialize() {
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
      this.initialize()
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
        <BackButton navigator={this.navigator} onPress={() => false} />
        <StatusBar hidden={true} />
          
          <View style={ style.contentContainer }>
              <View style={[style.firstRow, { backgroundColor: this.state.tokenAvailable ? null : 'red' }]}>
                <Touchable style={{ flex: 1 }} delayLongPress={500} onLongPress={() => this.navigator.push(Routes.debug.main)} >
                  <Image style={{ width: 150, height: 150 }} source={require('../../../App/Images/logo_big.png')} />
                </Touchable>
                <Text style={ style.text }>Securely store and verify personal information.</Text>
              </View>
              <LifekeyFooter
                backgroundColor={ Palette.consentBlue }
                middleButtonText={ this.state.ready && "Let's start"}
                middleButtonIcon={ !this.state.ready && <Spinner color={ Palette.consentWhite }/>}
                onPressMiddleButton={() => this.navigator.push(Routes.onboarding.register)}
              />
          </View>

      </Container>
    )
  }
}

const style = {
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  firstRow: {
    width: "100%",
    backgroundColor: Palette.consentWhite,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  "text": {
    "color": Palette.consentBlue,
    "maxWidth": 200, 
    "fontSize": 16, 
    "textAlign": 
    "center", 
    "marginTop": 64,
    "marginBottom": -96 // To center image, negate the font size (over two lines) along with the top margin.
  }
}
