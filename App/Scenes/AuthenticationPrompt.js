
import React from 'react'
import {
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  Platform,
  DeviceEventEmitter,
  ActivityIndicator
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Col,
  Row
} from 'native-base'

import Scene from '../Scene'
import Routes from '../Routes'
import BackButton from '../Components/BackButton'
import Button from '../Components/Button'

import ConsentUser from '../Models/ConsentUser'

import fp from 'react-native-fingerprint-android'

export default class AuthenticationPrompt extends Scene {
  constructor(props) {
    super(props)

    // this.props.auth_success_action
    // this.props.auth_failure_action
    // this.props.scene_after_auth_success

    this.state = {
      submitting: false,
      pin: '',
      feedback: ''
    }
  }
  
  componentDidMount() {
    this.init_fingerprint_if_available()
  }

  componentWillUnmount() {
    this.finalise_fingerprint_if_available()
    if (this.has_lockout_listener) {
      DeviceEventEmitter.removeListener(
        'fingerPrintLockoutEnded',
        this.reset_fingerprint.bind(this)
      )
    }
  }

  init_fingerprint_if_available() {
    Promise.all([
      fp.isHardwareDetected(),
      fp.hasPermission(),
      fp.hasEnrolledFingerprints()
    ]).then(res => {
      var [hardware, permission, enrolled] = res
      var fingerprint = hardware && permission && enrolled
      if (fingerprint) this.bind_fingerprint_callbacks.call(this)
      this.setState({
        fingerprint: fingerprint,
        fingerprint_detector_feedback: '',
        show_feedback: true
      })
    }).catch(err => {
      console.log('fp capability check error', err)
      this.setState({fingerprint: false})
    })
  }

  finalise_fingerprint_if_available() {
    if (!this.state.fingerprint) return
    return fp.cancelAuthentication().catch(
      console.log.bind(console, 'fp error')
    )
  }

  reset_fingerprint() {
    this.finalise_fingerprint_if_available().then(
      this.init_fingerprint_if_available.bind(this)
    ).then(_ => {
      this.setState({feedback: 'Fingerprint scanner ready'})
    })
  }

  bind_fingerprint_callbacks() {
    
    // ensure a listener for lockout reset is bound
    if (!this.has_lockout_listener) {
      DeviceEventEmitter.addListener(
        'fingerPrintLockoutEnded',
        this.reset_fingerprint.bind(this)
      )
      this.has_lockout_listener = true
    }
    
    fp.authenticate(warning => {
      this.setState({
        feedback: warning.message
      })
    }).then(_ => {
      this.setState({
        feedback: 'Authenticated, please wait...',
        submitting: true
      })
      this.success_action_and_navigate()
    }).catch(err => {
      if (err.code === fp.FINGERPRINT_ERROR_CANCELED) {
        this.setState({
          feedback: 'Authentication attempt cancelled'
        })
      } else if (!err.message) {
        this.reset_fingerprint.call(this)
      } else {
        this.setState({
          feedback: err.message
        })
      }
    })
  }

  update_pin(text) {
    this.setState({pin: text})
  }

  success_action_and_navigate() {
    setTimeout(_ => {
      (this.props.auth_success_action || Promise.resolve)().then(_ => {
        this.navigator.resetTo(this.props.auth_success_destination || Routes.main)
      }).catch(this.navigator.pop)
    }, 10000)
  }

  submit_with_pin() {
    if (this.state.submitting || this.state.pin.length !== 5) return
    var password = ConsentUser.getPasswordSync()
    
    if (this.state.pin === password) {
      this.setState({
        show_feedback: false,
        submitting: true,
        pin: ''
      })
      this.finalise_fingerprint_if_available()
      this.success_action_and_navigate()
    } else {
      // try again
      this.setState({
        pin: '',
        feedback: 'Incorrect PIN, please try again...'
      })
    }
  }

  render_fingerprint_auth_indicator() {
    return this.state.fingerprint ? (
      <View>
        <Row>
          {this.state.show_feedback && <Text>{this.state.feedback}</Text>}
        </Row>
        <Row>
          <Image source={require('../Images/verified_identity.png')}
                 onerror={console.log} />
        </Row>
      </View>
    ) : <View />
  }

  render_authorisation_prompt_message() {
    return (
      <Row>
        <Text>Please authenticate with your PIN</Text>{this.state.fingerprint && <Text> or fingerprint</Text>}
      </Row>
    )
  }

  render_pin_input() {
    return (
      <Row>
        <Col>
          <TextInput style={{width: 150}}
                     secureTextEntry={true}
                     placeholder='Your PIN'
                     onChangeText={this.update_pin.bind(this)}
                     editable={!this.state.submitting} />
        </Col>
        <Col>
          <Button onPress={this.submit_with_pin.bind(this)}
                  affirmative={true}
                  buttonText='Submit' />
        </Col>
      </Row>
    )
  }

  render_activity_indicator() {
    return this.state.submitting ? (
      <ActivityIndicator animating={true} size='large' />
    ) : <View />
  }
  
  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <Content>
          <Grid style={{margin: 15}}>
            <Col>
              {this.render_authorisation_prompt_message()}
              {this.render_fingerprint_auth_indicator()}
              {this.render_pin_input()}
              {this.render_activity_indicator()}
            </Col>
          </Grid>
        </Content>
      </Container>
    )
  }
}