
import React from 'react'
import {Text, TextInput, View, StyleSheet, Platform} from 'react-native'
import {Container, Content, Grid, Col, Row} from 'native-base'

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




      // DEBUG
      fingerprint: false
    }
  }
  
  componentDidMount() {
    // this.init_fingerprint_if_available()
  }

  componentWillUnmount() {
    // this.finalise_fingerprint_if_available()
  }

  init_fingerprint_if_available() {
    var fingerprint
    
    Promise.all([
      fp.isHardwareDetected(),
      fp.hasPermission(),
      fp.hasEnrolledFingerprints()
    ]).then(res => {
      var [hardware, permission, enrolled] = res
      fingerprint = hardware && permission && enrolled
      if (fingerprint) this.bind_fingerprint_success_callback()
      this.setState({
        fingerprint: fingerprint,
        fingerprint_detector_feedback: '',
        show_fingerprint_detector_feedback: true
      })
    }).catch(err => {
      console.log('fp capability check error', err)
      this.setState({fingerprint: false})
    })
  }

  finalise_fingerprint_if_available() {
    if (!this.state.fingerprint) return
    return fp.cancelAuthentication().catch(
      console.log.bind(console, 'fp auth cancellation error')
    )
  }

  bind_fingerprint_success_callback() {
    fp.authenticate(warning => {
      // console.log('fp auth warning', JSON.stringify(warning))
      this.setState({fingerprint_detector_feedback: warning.message})
    }).then(_ => {
      this.setState({fingerprint_detector_feedback: 'Authenticated, please wait.'})
      // show activity inidcator and start async operation
      // this.props.auth_success_action().then(_ => {
      //   // this.navigator.resetTo...
      // }).catch(err => {
      //   // hide activity indicator
      //   // this.navigator.pop()
      // })
    }).catch(err => {
      console.log('fp auth error', JSON.stringify(err))
      if (!err.message) {
        // something's wrong, maybe reset the detector?
        this.finalise_fingerprint_if_available().then(
          this.init_fingerprint_if_available
        ).then(_ => {
          this.setState({fingerprint_detector_feedback: ''})
        })
        return
      }
      this.setState({fingerprint_detector_feedback: err.message})
    })
  }

  image_load_error(err) {}

  update_pin(text) {
    this.setState({pin: text})
  }

  submit_with_pin() {
    if (this.state.submitting || this.state.pin.length !== 5) return
    
    try {
      var password = ConsentUser.getPasswordSync()
    } catch (e) {
      // the user is not logged in
      // (this shouldn't ever happen in production)
      
      // just set the password to the given pin for debugging purposes
      password = this.state.pin
    }
    
    if (this.state.pin === password) {
      // this.props.auth_success_action
      this.finalise_fingerprint_if_available()
      this.setState({show_fingerprint_detector_feedback: false, submitting: true, pin: ''})
      alert('authenticated!!')
    } else {
      // try again
      this.setState({pin: ''})
      alert('sorry, try again!!')
    }
  }

  render_fingerprint_auth_indicator() {
    return this.state.fingerprint ? (
      <Row>
        {/*fingerprint image*/}
        {
          this.show_fingerprint_detector_feedback && (
            <Text>{this.state.fingerprint_detector_feedback}</Text>
          )
        }
        {/*<Image src={{uri: ''}} onerror={this.image_load_error} />*/}
      </Row>
    ) : <Row />
  }

  render_authorisation_prompt_message() {
    return (
      <Row>
        <Text>Please authenticate this action with your PIN</Text>{this.state.fingerprint && <Text> or fingerprint</Text>}
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
          <Button onPress={this.submit_with_pin.bind(this)} affirmative={true} buttonText='Submit' />
        </Col>
      </Row>
    )
  }
  
  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <Content>
          <Grid style={{margin: 15}}>
            {/*<Col>*/}
            {this.render_authorisation_prompt_message()}
            {this.render_fingerprint_auth_indicator()}
            {this.render_pin_input()}
            {/*</Col>*/}
          </Grid>
        </Content>
      </Container>
    )
  }
}