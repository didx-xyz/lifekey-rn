/**
 * Lifekey App
 * @copyright 2016 - 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import PropTypes from "prop-types"
import Scene from '../../Scene'
import Palette from '../../Palette'
// import Routes from '../../Routes'
import Logger from '../../Logger'
import ConsentUser from '../../Models/ConsentUser'

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

    this.screenData = [
      {
        largeText: 'Create your username',
        smallText: 'Don\'t worry you can change this at any time',
        // bottomText: 'I already have a key',
        bottomText: ''
      },
      {
        largeText: 'Please enter your personal email address',
        smallText: 'To set up or recover your key',
        bottomText: '',
        // bottomText: 'What\'s this?'
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
      },
      {
        largeText: 'Thanks for activating!',
        smallText: 'Please wait while we create your Decentralised Identifier on the Consent Blockchain...',
        bottomText: ''
      }
    ]

    this._steps = [
      {
        largeText: 'Create your username',
        smallText: 'Don\'t worry you can change this at any time',
        // bottomText: 'I already have a key',
        bottomText: ''
      },
      {
        largeText: 'Please enter your personal email address',
        smallText: 'To set up or recover your key',
        bottomText: '',
        // bottomText: 'What\'s this?'
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
      },
      {
        largeText: 'Thanks for activating!',
        smallText: 'Please wait while we create your Decentralised Identifier on the Consent Blockchain...',
        bottomText: ''
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
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._onKeyboardDidShow())
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._onKeyboardDidHide())
    this._fadeTextIn()

    this.context.userHasActivated(this.registrationCallback.bind(this))
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

    // InteractionManager.runAfterInteractions(() => {
    //   console.log("GOT TO CALL BACK")
    //   callback()
    // })

    // Set timeout is used because of this: https://github.com/facebook/react-native/issues/8624
    setTimeout(() => {
      callback()
    }, 1000)
  }

  _onKeyboardDidShow() {
    this.setState({screenHeight: this.state.screenHeight - (this.state.originalScreenHeight * 0.1)})
  }

  _onKeyboardDidHide() {
    this.setState({screenHeight: this.state.screenHeight + (this.state.originalScreenHeight * 0.1)})
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

  goToPreviousStep() {
    if (this.state.step !== 0) {
      this._fadeTextOut(() => {
        this._fadeTextIn(() => this.setState({ step: this.state.step - 1 }))
      })
    }
  }

  resetRegistration() {
    this.setState({
      step: 0, // The beginning
      user: { username: '', email: '', pin: '' }
    }, () => {
      this._fadeTextIn(() => { })
    })
  }

  setUserState(key, value, next){
    let user = this.state.user
    user[key] = value
    this.setState({ user: user }, next)
  }

  // etcetc
  goToStep(activeStepNumber, animate){
    
    // Is validation necessary at this point? 

    Keyboard.dismiss()
    if(animate){
      this._fadeTextOut(() => {
        this._fadeTextIn(() => {
          this.setState({ step: activeStepNumber })
        })
      })
    }
    else{
      this.setState({ step: activeStepNumber })
    }
  }
  
  attemptToRegisterUser() { 
    if (this.state.user.pin.length === 5 && this.state.user.username.length > 0 && this.state.user.email.length > 0) {
      this.setState({ magicLinkRequested: true }, () => {
        this.requestMagicLink()
        this.goToStep(STEP_MAGIC_LINK, true) // While we wait... 
      })
    }
  }

  requestMagicLink() {

    ConsentUser.register(this.state.user)
    .then(result => {
      ToastAndroid.show('Registering...', ToastAndroid.SHORT)
    })
    .catch(error => {
      Logger.error('Not registered', this.filename, error)
      switch (error.status) {
        case 400: // Validation error
          ToastAndroid.show('Registeration unsuccessful...', ToastAndroid.SHORT)
          this.resetRegistration()
        default: {
          ToastAndroid.show('An unknown error occurred. Registeration unsuccessful...', ToastAndroid.SHORT)
        }
      }
    })
  }

  // Called from LifekeyRn when DID is received via Firebase notification 
  registrationCallback() {
    this.goToStep(STEP_WAITING_FOR_DID)
  }

  renderInputView(activeStepNumber) {
    switch (activeStepNumber) {
      case STEP_USERNAME:
        return (<OnboardingTextInputAndroid
                  onChangeText={text => this.setUserState('username', text) }
                  autoCapitalize="sentences"
                  fontSize={30}
                  onSubmit={() => this.goToStep(STEP_EMAIL, true)}
                />)

      case STEP_EMAIL:
        return (<OnboardingTextInputAndroid
                  onChangeText={text => this.setUserState('email', text) }
                  autoCapitalize="none"
                  fontSize={24}
                  onSubmit={() => this.goToStep(STEP_PIN, true)}
                />)

      case STEP_PIN:
        return (<Touchable style={{ flex: 1 }} onPress={() => this.pinInput.focus()}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {
                      !this.state.magicLinkRequested ?
                      <HexagonDots current={ this.state.user.pin.length < 5 ? this.state.user.pin.length : 4} />
                    :
                      <Nachos.Spinner color='blue'/>
                    }
                    <Dots current={this.state.user.pin.length} />
                    <TextInput
                      ref={(_ref) => this.pinInput = _ref }
                      autoFocus={true}
                      returnKeyType="done"
                      keyboardType="phone-pad"
                      onChangeText={(text) => this.setUserState('pin', text, this.attemptToRegisterUser)}
                      style={[style.pinInput]}
                    />
                  </View>
                </Touchable>)

      case STEP_MAGIC_LINK:
        return (<View style={{ flex: 1 }}>
                  <Text style={{ textAlign: "center" }}>Please check the inbox of {this.state.user.email} for a link to activate your account</Text>
                </View>)
      case STEP_WAITING_FOR_DID:
        return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Nachos.Spinner color='blue'/>
                </View>
               )
    }
  }

  render() {
    return (
      <Container>
        <Content keyboardShouldPersistTaps="always">
          <AndroidBackButton onPress={() => this._hardwareBackHandler()}/>
          <StatusBar hidden={true} />
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Grid>
              <Col style={[style.sceneColumn, { height: this.state.screenHeight }]}>
                { /* center content */ }
                <Row style={{ flex: 13, flexDirection: 'column' }}>

                  { /* LARGE TEXT */ }
                  <Row style={style.largeTextRow}>
                    <Animated.View style= {{
                      opacity: this.state.fadeTransitionValue,
                      marginBottom: this.state.moveTransitionValue
                    }}>
                      <Text style={{ fontSize: 38, textAlign: 'center' }}>{this.screenData[this.state.step].largeText}</Text>
                    </Animated.View>
                  </Row>

                  { /* SMALL TEXT */ }
                  <Row style={[style.smallTextRow]}>
                    <Animated.View style={{
                      opacity: this.state.fadeTransitionValue,
                      flex: 1
                    }}>
                      <Text style={{ fontSize: 18, textAlign: 'center' }}>{this.screenData[this.state.step].smallText}</Text>
                    </Animated.View>
                  </Row>

                  { /* TEXT INPUT */}
                  <Row style= {style.textInputRow}>
                    { this.renderInputView(this.state.step) }
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
                        onPress={() => alert('Coming soon...')}
                      >
                        <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                          <Text style={{ fontSize: 20 }}>{this.screenData[this.state.step].bottomText}</Text>
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
