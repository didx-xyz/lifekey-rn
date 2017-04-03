/**
 * Lifekey App
 * @copyright 2016 - 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Palette from '../../Palette'
// import Routes from '../../Routes'
import Logger from '../../Logger'

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
  TextInput
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

const DEBUG = false
const STEP_USERNAME = 0
const STEP_EMAIL = 1
const STEP_PIN = 2
const STEP_MAGIC_LINK = 3

export default class Register extends Scene {

  constructor(props) {
    super(props)
    this._steps = [
      {
        largeText: 'Create your username',
        smallText: 'Don\'t worry you can change this at any time',
        bottomText: 'I already have a key'
      },
      {
        largeText: 'Please enter your personal email address',
        smallText: 'To set up or recover your key',
        bottomText: 'What\'s this?'
      },
      {
        largeText: 'Please enter a secure pin',
        smallText: 'Do not forget this pin. It cannot be recovered.',
        bottomText: 'More info'
      },
      {
        largeText: 'Check your mail for a magic link',
        smallText: 'The link will be valid for 24 hours',
        bottomText: 'Resend link'
      }
    ]
    this.state = {
      step: 0, // The beginning
      textInputValue: '',
      username: null,
      email: null,
      pin: '',
      largeText: this._steps[0].largeText,
      smallText: this._steps[0].smallText,
      bottomText: this._steps[0].bottomText,
      moveTransitionValue: new Animated.Value(300),
      fadeTransitionValue: new Animated.Value(0)
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

  componentDidFocus() {
    super.componentDidFocus()
    this._oti.focus()
  }

  componentDidMount() {
    super.componentDidMount()
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => this._onKeyboardWillShow())
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => this._onKeyboardWillHide())
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._onKeyboardDidShow())
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._onKeyboardDidHide())
    this._fadeTextIn()
    this._eventTimeline.pushEvent('Started registration')
  }

  _fadeTextIn(callback) {
    //  Move
    Animated.timing(
      this.state.moveTransitionValue,
      { toValue: 0 }
    ).start()
    setTimeout(() => {
      // Fade
      Animated.timing(
        this.state.fadeTransitionValue,
        { toValue: 1 }
      ).start()
    }, 150)
    if (callback) {
      InteractionManager.runAfterInteractions(() => {
        callback()
      })
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
    InteractionManager.runAfterInteractions(() => {
      callback()
    })

  }

  _onKeyboardWillShow() {
    Logger.info('KeyboardWillShow', this._fileName)
  }

  _onKeybordWillHide() {
    Logger.info('KeyboardWillHide', this._fileName)

  }

  _onKeyboardDidShow() {
    Logger.info('KeyboardDidShow', this._fileName)
  }

  _onKeyboardDidHide() {
    Logger.info('KeyboardDidHide', this._fileName)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _hardwareBackHandler() {
    Logger.info("Hardware back handler")
    if (this.state.step < 1) {
      Logger.info("Navigatorpop")
      this.navigator.pop()
    } else {
      this._stepBack()
      Logger.info("Step back")
    }
    return true
  }

  _stepBack() {
    if (this.state.step !== 0) {
      this._fadeTextOut(() => {
        this._fadeTextIn(() => {
          // Update state to reflect we are on the 2nd step now
          this.setState({
            step: this.state.step - 1,
          }, () => {
            // Clear TextInput value
            this.setState({
              textInputValue: ''
            })
          })
        })
      })
    }
  }

  _stepForward() {
    const onStepTextInputValue = this.state.textInputValue

    switch (this.state.step) {
    // username -> email
    case STEP_USERNAME:

      // If a username was entered
      if (onStepTextInputValue) {

        Keyboard.dismiss()

        // Give the keyboard time to close
        setTimeout(() => {
          this._eventTimeline.pushEvent(`Username saved as: ${onStepTextInputValue}`)
          // Change text to next screen
        }, 300)

        this._fadeTextOut(() => {
          this._fadeTextIn(() => {
            // Update state to reflect we are on the 2nd step now
            this.setState({
              step: STEP_EMAIL,
              username: onStepTextInputValue
            }, () => {
              // Clear TextInput value
              this.setState({
                textInputValue: ''
              })
            })
          })
        })

      } else {
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
      }
      break


    // email -> pin
    case STEP_EMAIL:
      Logger.info('stepping 1 - 2')
      if (onStepTextInputValue) {
        Keyboard.dismiss()

        setTimeout(() => {
          this._eventTimeline.pushEvent(`Email saved as: ${onStepTextInputValue}`)
        }, 500)
        // Update the state to show we are on the 3rd step
        // this.setState({
        //   step: 2,
        //   email: onStepTextInputValue
        // }, () => {
        //   this.setState({
        //     textInputValue: ''
        //   }, () => {
        //     this.pinInput.focus()
        //   })
        // })
        this._fadeTextOut(() => {
          this._fadeTextIn(() => {
            // Update state to reflect we are on the 2nd step now
            this.setState({
              step: STEP_PIN,
              email: onStepTextInputValue
            }, () => {
              // Clear TextInput value
              this.setState({
                textInputValue: ''
              })
            })
          })
        })
      } else {
        if (Platform.OS === 'android') {
          const dialog = new DialogAndroid()
          dialog.set({
            title: 'Pin can\'t be empty!',
            content: 'You must enter a username to uniquely identify yourself on the network.',
            positiveText: 'OK'
          })
          dialog.show()
        } else {
          // iOS
          alert('TODO')
        }
      }
      break
    // pin - magic link
    case STEP_PIN:
      Logger.info('stepping 2 - 3')
      if (onStepTextInputValue) {
        setTimeout(() => {
          this._eventTimeline.pushEvent('Pin set')
        }, 1000)

        // Update the state to show we are on the 3rd step
        this.setState({
          step: 3,
          email: onStepTextInputValue
        }, () => {
          this.setState({
            textInputValue: ''
          })
        })

      } else {
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
      }
      break
    }
  }

  _onPinChanged(text) {
    this.setState({
      textInputValue: text
    }, () => {
      if (text.length === 5) {
        this._stepForward()
      }
    })
  }

  renderInputView() {
    switch (this.state.step) {
    case STEP_USERNAME:
      return (<OnboardingTextInputAndroid
                onChangeText={(text) => this.setState({ textInputValue: text })}
                value={this.state.textInputValue}
                ref={oti => { this._oti = oti }}
                onSubmit={() => this._stepForward()}
              />)

    case STEP_EMAIL:
      return (<OnboardingTextInputAndroid
                onChangeText={(text) => this.setState({ textInputValue: text })}
                value={this.state.textInputValue}
                ref={oti => { this._oti = oti }}
                onSubmit={() => this._stepForward()}
              />)

    case STEP_PIN:
      return (<Touchable style={{ flex: 1 }} onPress={() => this.pinInput.focus()}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Dots current={this.state.textInputValue.length} />
                  <HexagonDots current={this.state.textInputValue.length} />
                  <TextInput
                    ref={(_ref) => this.pinInput = _ref }
                    autoFocus={true}
                    returnKeyType="done"
                    keyboardType="phone-pad"
                    onChangeText={(text) => this._onPinChanged(text)}
                    style={[style.pinInput]}
                  />
                </View>
              </Touchable>)

    case STEP_MAGIC_LINK:
      return (<View style={{ flex: 1 }}>
                <Text>Magic link sent</Text>
              </View>)
    }
  }

  render() {
    Logger.info('STEP: ', this.state.step)
    return (
      <Container>
        <Content keyboardShouldPersistTaps="always">
          <AndroidBackButton onPress={() => this._hardwareBackHandler()}/>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Grid>
              <Col style={[style.sceneColumn, { height: this.props.screenHeight }]}>
                { /* Event timeline */}
                <Touchable style={{ backgroundColor: 'red' }} onPress={() => alert('yes')}>
                  <Row style={style.timelineRow}>
                    <EventTimeline
                      ref={(eventTimeline) => this._eventTimeline = eventTimeline}
                    />
                  </Row>
                </Touchable>
                { /* center content */ }
                <Row style={{ flex: 13, flexDirection: 'column' }}>

                  { /* LARGE TEXT */ }
                  <Row style={style.largeTextRow}>
                    <Animated.View style= {{
                      opacity: this.state.fadeTransitionValue,
                      marginBottom: this.state.moveTransitionValue
                    }}>
                      <Text style={{ fontSize: 38 }}>{this._steps[this.state.step].largeText}</Text>
                    </Animated.View>
                  </Row>

                  { /* SMALL TEXT */ }
                  <Row style={[style.smallTextRow]}>
                    <Animated.View style={{
                      opacity: this.state.fadeTransitionValue,
                      flex: 1
                    }}>
                      <Text style={{ fontSize: 18, textAlign: 'center' }}>{this._steps[this.state.step].smallText}</Text>
                    </Animated.View>
                  </Row>

                  { /* TEXT INPUT */}
                  <Row style= {[
                    style.textInputRow,
                    { backgroundColor: this.state.step < STEP_PIN ? null : Palette.consentOffWhite }
                  ]}>
                    { this.renderInputView() }
                  </Row>
                </Row>

                { /* Footer content */ }
                <Row style= {style.bottomContentRow}>
                  <View style={style.bottomContentRowWrapperView}>
                    <View>
                      <Text>Help</Text>
                    </View>
                    <View>
                      <Touchable
                        onPress={() => alert('No you don\'t')}
                      >
                        <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                          <Text style={{ fontSize: 20 }}>{this._steps[this.state.step].bottomText}</Text>
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
    backgroundColor: DEBUG ? 'blue' : null,
    paddingLeft: 25,
    paddingRight: 25
  },
  timelineRow: {
    height: 8,
    flexDirection: 'column',
    backgroundColor: DEBUG ? 'green' : null,
    paddingLeft: 35,
    paddingRight: 35
  },
  bottomContentRow: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: DEBUG ? 'red' : null,
    paddingLeft: 35,
    paddingRight: 35
  },
  bottomContentRowWrapperView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallTextRow: {
    flex: 1.5,
    paddingTop: 5,
    backgroundColor: DEBUG ? 'orange' : null,
    paddingLeft: 35,
    paddingRight: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  largeTextRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: DEBUG ? 'purple' : null,
    paddingLeft: 35,
    paddingRight: 35
  },
  pinInput: {
    position: "absolute",
    top: -1000
  }
})
