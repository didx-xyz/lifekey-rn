
import React from 'react'
import {
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  Platform,
  DeviceEventEmitter,
  ActivityIndicator,
  TouchableOpacity
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

import HexagonDots from '../Components/HexagonDots'
import Dots from '../Components/Dots'
import BackButton from '../Components/BackButton'
import Button from '../Components/Button'

import ConsentUser from '../Models/ConsentUser'

import fp from 'react-native-fingerprint-android'

export default class AuthenticationPrompt extends Scene {
  constructor(props) {
    super(props)
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
      this.input.blur()
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
    if (text.length === 5) {
      return this.setState({
        pin: text
      }, this.submit_with_pin.bind(this))
    }
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
    try {
      var password = ConsentUser.getPasswordSync()
    } catch (e) {
      password = this.state.pin
    }
    
    if (this.state.pin === password) {
      this.setState({
        show_feedback: false,
        submitting: true
      })
      this.input.blur()
      this.finalise_fingerprint_if_available()
      this.success_action_and_navigate()
    } else {
      // try again
      this.input.focus()
      this.setState({
        pin: '',
        feedback: 'Incorrect PIN, please try again...'
      })
    }
  }

  render_authorisation_prompt_message_and_feedback() {
    return (
      <View style={{marginTop: 20, marginBottom: 60}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Text>Please authenticate with your PIN</Text>{this.state.fingerprint && <Text> or fingerprint</Text>}
        </View>
        <View style={{marginTop: 5, alignItems: 'center', justifyContent: 'center'}}>
          {this.state.show_feedback && <Text style={{fontWeight: 'bold'}}>{this.state.feedback}</Text>}
        </View>
      </View>
    )
  }

  render_pin_input() {
    return (
      <TextInput ref={r => this.input = r}
                 style={{position: 'absolute', top: -1000}}
                 secureTextEntry={true}
                 autoFocus={true}
                 placeholder='Your PIN'
                 returnKeyType='done'
                 keyboardType='phone-pad'
                 onChangeText={this.update_pin.bind(this)}
                 editable={!this.state.submitting} />
    )
  }

  render_dots_crap() {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <HexagonDots width={134} height={134} current={this.state.pin.length} />
        <TouchableOpacity style={{marginTop: 60}} onPress={_ => this.input.focus()}>
          <Dots current={this.state.pin.length} />
        </TouchableOpacity>
      </View>
    )
  }

  render_activity_indicator() {
    return this.state.submitting ? (
      <ActivityIndicator animating={true} size='large' />
    ) : <View />
  }
  
  render() {
    return (
      <Container style={{margin: 10}}>
        <BackButton navigator={this.navigator} />
        <View>
          {this.render_authorisation_prompt_message_and_feedback()}
          {this.render_dots_crap()}
          {this.render_pin_input()}
          {this.render_activity_indicator()}
        </View>
      </Container>
    )
  }
}