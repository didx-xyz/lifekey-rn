/**
 * Lifekey App
 * @copyright 2016 - 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import PropTypes from "prop-types"
import Scene from '../../Scene'
import Logger from '../../Logger'
import ConsentUser from '../../Models/ConsentUser'

import Session from '../../Session'

import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Animated,
  InteractionManager,
  TextInput,
  ToastAndroid
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Row,
  Col
} from 'native-base'

import HexagonDots from '../../Components/HexagonDots'
import Dots from '../../Components/Dots'
import OnboardingTextInputAndroid from '../../Components/OnboardingTextInputAndroid'
import EventTimeline from '../../Components/EventTimeline'
import Touchable from '../../Components/Touchable'
import DialogAndroid from 'react-native-dialogs'
import AndroidBackButton from 'react-native-android-back-button'
import * as Nachos from 'nachos-ui'

// const DEBUG = false
const STEP_USERNAME = 0
const STEP_EMAIL = 1
const STEP_PIN = 2
const STEP_MAGIC_LINK = 3
const STEP_WAITING_FOR_DID = 4

class Register extends Scene {

  constructor(props) {
    super(props)

    this._steps = [
      {
        index: 0,
        largeText: 'Create your username',
        smallText: 'Don\'t worry you can change this at any time',
        // bottomText: 'I already have a key',
        bottomText: '',
        success: function(value, callback) {
          Keyboard.dismiss()
          this._fadeTextOut(() => {
            this._fadeTextIn(() => {
              this.setState({
                step: this.state.step + 1,
                username: this.state.textInputValue,
                textInputValue: ''
              })
            })
          })
          this._eventTimeline.pushEvent(`Username saved as: ${value}`)
        },
        failure: function() {
          // Tell the user they must enter something
          if (Platform.OS === 'android') {
            const dialog = new DialogAndroid()
            dialog.set({
              title: 'Username can\'t be empty!',
              content: 'You must enter a username to uniquely identify yourself on the network.',
              positiveText: 'OK'
            })
            dialog.show()
          } else {
            // iOS
            alert('TODO')
          }
        },
        component: function() {
          return (
            <OnboardingTextInputAndroid onChangeText={(text) => this.setState({textInputValue: text})}
                                        autoCapitalize="sentences"
                                        fontSize={30}
                                        value={this.state.textInputValue}
                                        ref={oti => this._oti = oti}
                                        onSubmit={() => this._stepForward()} />
          )
        }
      },
      {
        index: 1,
        largeText: 'Please enter your personal email address',
        smallText: 'To set up or recover your key',
        bottomText: '',
        success: function(value, callback) {
          Keyboard.dismiss()
          this._fadeTextOut(() => {
            this._fadeTextIn(() => {
              this.setState({
                step: this.state.step + 1,
                email: this.state.textInputValue,
                textInputValue: ''
              })
            })
          })
          this._eventTimeline.pushEvent(`Username saved as: ${value}`)
        },
        failure: function() {
          if (Platform.OS === 'android') {
            const dialog = new DialogAndroid()
            dialog.set({
              title: 'Email can\'t be empty!',
              content: 'You must enter an email address to uniquely identify yourself on the network.',
              positiveText: 'OK'
            })
            dialog.show()
          } else {
            // iOS
            alert('TODO')
          }
        },
        component: function() {
          return (
            <OnboardingTextInputAndroid onChangeText={(text) => this.setState({textInputValue: text})}
                                        autoCapitalize="none"
                                        fontSize={24}
                                        value={this.state.textInputValue}
                                        ref={oti => {this._oti = oti}}
                                        onSubmit={() => this._stepForward()} />
          )
        }
      },
      {
        index: 2,
        largeText: 'Please enter a secure pin',
        smallText: 'Do not forget this pin. It cannot be recovered.',
        bottomText: 'More info',
        success: function(value, callback) {
          this.setState({
            step: this.state.step + 1,
            pin: this.state.textInputValue,
            textInputValue: ''
          }, callback || function() {})
          this._eventTimeline.pushEvent(`Magic link sent to ${this.state.email}`)
        },
        failure: function() {
          // Tell the user they must enter something
          if (Platform.OS === 'android') {
            const dialog = new DialogAndroid()
            dialog.set({
              title: 'PIN can\'t be empty!',
              content: 'You must enter a PIN to secure your cryptographic keypair.',
              positiveText: 'OK'
            })
            dialog.show()
          } else {
            // iOS
            alert('TODO')
          }
        },
        component: function() {
          return (
            <Touchable style={{flex: 1}} onPress={_ => this.pinInput.focus()}>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {this.state.magicLinkRequested ? (
                  <Nachos.Spinner color='blue' />
                ) : (
                  <HexagonDots current={this.state.textInputValue.length < 5 ? this.state.textInputValue.length : 4} />
                )}
                <Dots current={this.state.textInputValue.length} />
                <TextInput ref={(_ref) => this.pinInput = _ref}
                          autoFocus={true}
                          returnKeyType="done"
                          keyboardType="phone-pad"
                          onChangeText={(text) => this._onPinChanged(text)}
                          style={[style.pinInput]} />
              </View>
            </Touchable>
          )
        }
      },
      {
        index: 3,
        largeText: 'Check your mail for a magic link',
        smallText: 'The link will be valid for 24 hours',
        bottomText: 'Resend link',
        success: function() {
          this._fadeTextOut(() => {
            this._fadeTextIn(() => {
              this.setState({
                step: this.state.step + 1,
                textInputValue: ''
              })
            })
          })
        },
        failure: function() {},
        component: function() {
          return (
            <View style={{flex: 1}}>
              <Text style={{textAlign: "center"}}>
                Please check the inbox of {this.state.email} for a link to activate your account
              </Text>
            </View>
          )
        }
      },
      {
        index: 4,
        largeText: 'Thanks for activating!',
        smallText: 'Please wait while we create your Decentralised Identifier on the Consent Blockchain...',
        bottomText: '',
        success: function() {},
        failure: function() {},
        component: function() {
          return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
              <Nachos.Spinner color='blue' />
            </View>
          )
        }
      }
    ]
    this.state = {
      step: 0, // The beginning
      user: {
        username: '',
        email: '',
        pin: ''
      },
      moveTransitionValue: new Animated.Value(300),
      fadeTransitionValue: new Animated.Value(0),
      magicLinkRequested: false,
      screenHeight: this.props.screenHeight,
      originalScreenHeight: this.props.screenHeight
    }
  }

  componentDidMount() {
    super.componentDidMount()
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow', () => this._onKeyboardDidShow()
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide', () => this._onKeyboardDidHide()
    )
    this._fadeTextIn()
    this.context.userHasActivated(this._steps[3].success.bind(this))
    this._eventTimeline.pushEvent('Started registration')
  }

  _fadeTextIn(callback) {
    //  Move
    Animated.timing(
      this.state.moveTransitionValue,
      { toValue: 0, isInteraction: false }
    ).start()

    setTimeout(() => {
      
      // Fade
      Animated.timing(
        this.state.fadeTransitionValue,
        { toValue: 1, isInteraction: false }
      ).start()

    }, 150)

    if (callback) {
      // InteractionManager.runAfterInteractions(() => {
      //   callback()
      // })

      // Set timeout is used because of this: https://github.com/facebook/react-native/issues/8624
      setTimeout(() => {
        callback()
      }, 0)
    }
  }

  _fadeTextOut(callback) {
    //  Move
    Animated.timing(
      this.state.moveTransitionValue,
      { toValue: 300 }
    ).start()

    setTimeout(() => {
      // Fade
      Animated.timing(
        this.state.fadeTransitionValue,
        { toValue: 0 }
      ).start()
    }, 150)
  }

  _onKeyboardDidShow() {
    this.setState({
      screenHeight: this.state.screenHeight - (this.state.originalScreenHeight * 0.2)
    })
    Logger.info('KeyboardDidShow', this.filename)
  }

  _onKeyboardDidHide() {
    this.setState({
      screenHeight: this.state.screenHeight + (this.state.originalScreenHeight * 0.2)
    })
    Logger.info('KeyboardDidHide', this.filename)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _hardwareBackHandler() {
    if (this.state.step < STEP_EMAIL) {
      this.navigator.pop()
    } else {
      if (!this.state.step === STEP_MAGIC_LINK) {
        this.goToPreviousStep()
      }
    }
    return true
  }

  _stepBack() {
    if (this.state.step === 0) return
    this._fadeTextOut(() => {
      this._fadeTextIn(() => {
        this.setState({
          step: this.state.step - 1,
          textInputValue: ''
        })
      })
    })
  }

  _resetRegistration() {
    Promise.all([
      this.setState({
        step: 0, // The beginning
        textInputValue: '',
        username: null,
        email: null,
        pin: '',
        timelineExpanded: false,
        largeText: this._steps[0].largeText,
        smallText: this._steps[0].smallText,
        bottomText: this._steps[0].bottomText,
        moveTransitionValue: new Animated.Value(300),
        fadeTransitionValue: new Animated.Value(0)
      }),
      this._fadeTextIn(() => {
        this._eventTimeline.pushEvent('Restarted registration')
      })
    ]).catch(console.log)
  }

  _stepForward(callback) {
    var onStepTextInputValue = this.state.textInputValue.toLowerCase().trim()
    if (onStepTextInputValue) {
      return this._steps[
        this.state.step
      ].success.call(
        this, onStepTextInputValue, callback
      )
    }
    this._steps[this.state.step].failure.call(this)
  }

  _onPinChanged(text) {
    this.setState({
      textInputValue: text
    }, _ => {
      if (text.length < 5) return
      Keyboard.dismiss()
      this._stepForward(_ => {
        this._requestMagicLink().then(_ => {
          this.setState({magicLinkRequested: true})
        }).catch(err => {
          if (err.status === 400) {
            alert('The username or email already exists or is invalid')
            this._resetRegistration()
            return
          } else {
            alert('An error occured.')
            console.log("ERROR ---------> ", err)
          }
        })
      })
    })
  }

  _requestMagicLink() {
    return ConsentUser.register(
      this.state.username,
      this.state.email,
      this.state.pin
    ).then(result => {
      Session.update(result)
      return Promise.resolve()
    })
  }

  _toggleTimeline() {
    this.setState({
      timelineExpanded: !this.state.timelineExpanded
    }, this.forceUpdate)
  }

  render() {
    return (
      <Container>
        <Content keyboardShouldPersistTaps="always">
          <AndroidBackButton onPress={() => this._hardwareBackHandler()}/>
          <StatusBar hidden={true} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Grid>
              
              <Col style={[style.sceneColumn, {height: this.state.screenHeight}]}>
                
                {/* Event timeline */}
                <Touchable style={{backgroundColor: 'red'}} onPress={() => this._toggleTimeline()}>
                  <Row style={[style.timelineRow, {flex: this.state.timelineExpanded ? 15 : 1}]}>
                    <EventTimeline ref={(et) => this._eventTimeline = et} />
                  </Row>
                </Touchable>
                
                {/* center content */}
                <Row style={{flex: 13, flexDirection: 'column'}}>

                  {/* LARGE TEXT */}
                  <Row style={style.largeTextRow}>
                    <Animated.View style={{
                      opacity: this.state.fadeTransitionValue,
                      marginBottom: this.state.moveTransitionValue
                    }}>
                      <Text style={{fontSize: 38, textAlign: 'center'}}>
                        {this._steps[this.state.step].largeText}
                      </Text>
                    </Animated.View>
                  </Row>

                  {/* SMALL TEXT */}
                  <Row style={[style.smallTextRow]}>
                    <Animated.View style={{
                      opacity: this.state.fadeTransitionValue,
                      flex: 1
                    }}>
                      <Text style={{fontSize: 18, textAlign: 'center'}}>
                        {this._steps[this.state.step].smallText}
                      </Text>
                    </Animated.View>
                  </Row>

                  {/* TEXT INPUT */}
                  <Row style= {style.textInputRow}>
                    {this._steps[this.state.step].component.call(this)}
                  </Row>
                </Row>

                {/* Footer content */}
                <Row style={style.bottomContentRow}>
                  <View style={style.bottomContentRowWrapperView}>
                    <View>
                      <Text>Help</Text>
                    </View>
                    <View>
                      <Touchable onPress={() => alert('No you don\'t')}>
                        <View style={{paddingTop: 20, paddingBottom: 20}}>
                          <Text style={{fontSize: 20}}>
                            {this._steps[this.state.step].bottomText}
                          </Text>
                        </View>
                      </Touchable>
                    </View>
                  </View>
                </Row>

              </Col>
            </Grid>
          </TouchableWithoutFeedback>
        </Content>
      </Container>
    )
  }
}

const style = StyleSheet.create({
  sceneColumn: {
    flex: 1,
  },
  textInputRow: {
    flex: 4,
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25
  },
  timelineRow: {
    flexDirection: 'column',
    paddingLeft: 35,
    paddingRight: 35
  },
  bottomContentRow: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 35,
    paddingRight: 35
  },
  bottomContentRowWrapperView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallTextRow: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 35,
    paddingRight: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  largeTextRow: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingLeft: 35,
    paddingRight: 35
  },
  pinInput: {
    position: "absolute",
    top: -1000
  }
})

Register.contextTypes = {
  // state
  userHasActivated: PropTypes.func
}

export default Register
