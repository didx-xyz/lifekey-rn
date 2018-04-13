import React from 'react';
import PropTypes from 'prop-types';
import Scene from '../../Scene';
import Design from '../../DesignParameters';
import Palette from '../../Palette';
import Crypto from '../../Crypto';
import Config from '../../Config';
// import Routes from '../../Routes'
import Logger from '../../Logger';
import ConsentUser from '../../Models/ConsentUser';

import Svg, { Circle } from 'react-native-svg';

import {
  Dimensions,
  InteractionManager,
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Animated,
  TextInput,
  ToastAndroid,
  AlertIOS
} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import HexagonDots from '../../Components/HexagonDots';
// import Dots from '../../Components/Dots'
import OnboardingTextInputAndroid from '../../Components/OnboardingTextInputAndroid';
import EventTimeline from '../../Components/EventTimeline';
import Touchable from '../../Components/Touchable';
import DialogAndroid from 'react-native-dialogs';
import AndroidBackButton from 'react-native-android-back-button';
import AuthScreen from '../../Components/SceneComponents/AuthScreen';
import * as Nachos from 'nachos-ui';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// const DEBUG = false
const STEP_USERNAME = 0;
const STEP_EMAIL = 1;
const STEP_PIN = 2;
const STEP_MAGIC_LINK = 3;
const STEP_WAITING_FOR_DID = 4;
const STEP_ERROR = 5;

class Register extends Scene {
  constructor(props) {
    super(props);
    
    let isSensorAvailable = true;

    this.screenData = [
      {
        largeText: 'Create your username',
        smallText: "Don't worry you can change this at any time",
        // bottomText: 'I already have a key',
        bottomText: ''
      },
      {
        largeText: 'Please enter your personal email address',
        smallText: 'To set up or recover your key',
        bottomText: ''
        // bottomText: 'What\'s this?'
      },
      {
        largeText: 'Create a 5-digit key PIN.',
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
        smallText:
          'Please wait while we create your Decentralised Identifier on the Consent Blockchain...',
        bottomText: ''
      },
      {
        largeText: 'Something went wrong!',
        smallText:
          'There was an error while trying to register. Please try again.'
      }
    ];

    this.state = {
      step: 0, // The beginning
      user: {
        username: '',
        email: '',
        pin: ''
      },
      loading_indicator: false,
      moveTransitionValue: new Animated.Value(300),
      fadeTransitionValue: new Animated.Value(0),
      inputFadeTransitionValue: new Animated.Value(1),
      magicLinkRequested: false,
      screenHeight: Dimensions.get('window').height,
      screenTextColor: Palette.consentOffBlack,
      screenBackgroundColor: Palette.consentOffWhite
    };

    this.boundSetUserPin = this.setUserPin.bind(this);
  }

  componentWillMount() {
    // this.keyboardDidShowListener = Keyboard.addListener(
    //   'keyboardDidShow',
    //   this._keyboardDidShow.bind(this)
    // );
    // this.keyboardDidHideListener = Keyboard.addListener(
    //   'keyboardDidHide',
    //   this._keyboardDidHide.bind(this)
    // );

    FingerprintScanner
    .isSensorAvailable()
    .catch(error => {
      isSensorAvailable = false;
      console.log('isSensorAvailable: ', error);
    })  

  }

  _keyboardDidShow(e) {
    let height = e.startCoordinates.screenY - e.endCoordinates.screenY;
    let newSize =
      this.state.step === STEP_PIN
        ? Dimensions.get('window').height - 175
        : Dimensions.get('window').height - height;
    this.setState({ screenHeight: newSize });
  }

  _keyboardDidHide(e) {
    this.setState({ screenHeight: Dimensions.get('window').height });
  }

  componentDidMount() {
    super.componentDidMount();
    this._fadeTextIn();

    this.context.userHasActivated(this.registrationCallback.bind(this));
  }

  _fadeTextIn(callback) {
    //  Move
    Animated.timing(this.state.moveTransitionValue, {
      toValue: 0,
      isInteraction: false
    }).start();

    setTimeout(() => {
      // Fade
      Animated.timing(this.state.fadeTransitionValue, {
        toValue: 1,
        isInteraction: false
      }).start();
    }, 150);

    setTimeout(() => {
      // Fade
      Animated.timing(this.state.inputFadeTransitionValue, {
        toValue: 1,
        isInteraction: false
      }).start();
    }, 200);

    if (callback) {
      // Set timeout is used because of this: https://github.com/facebook/react-native/issues/8624
      setTimeout(() => {
        callback();
      }, 0);
    }
  }

  _fadeTextOut(callback) {
    //  Move
    Animated.timing(this.state.moveTransitionValue, { toValue: 300 }).start();

    setTimeout(() => {
      // Fade
      Animated.timing(this.state.fadeTransitionValue, { toValue: 0 }).start();
    }, 0);

    setTimeout(() => {
      // Fade
      Animated.timing(this.state.inputFadeTransitionValue, {
        toValue: 0
      }).start();
    }, 0);
    // Set timeout is used because of this: https://github.com/facebook/react-native/issues/8624
    setTimeout(() => {
      callback();
    }, 900);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    if (this.interaction) this.interaction.cancel();
  }

  _hardwareBackHandler() {
    if (this.state.step < STEP_MAGIC_LINK) {
      this.goToPreviousStep();
    }
    return true;

    // if (this.state.step < STEP_EMAIL) {
    //   this.navigator.pop()
    // } else {
    //   if (!this.state.step === STEP_MAGIC_LINK) {
    //     this.goToPreviousStep()
    //   }
    // }
    // return true
  }

  goToPreviousStep() {
    if (this.state.step !== 0) {
      this.goToStep(this.state.step - 1, true);
    }
    // if (this.state.step !== 0) {
    //   this._fadeTextOut(() => {
    //     this._fadeTextIn(() => this.setState({ step: this.state.step - 1 }))
    //   })
    // }
  }

  resetRegistration() {
    this.setState(
      {
        user: { username: '', email: '', pin: '' }
      },
      () => {
        this.goToStep(STEP_ERROR, true);
      }
    );
  }

  setUserState(key, value, next) {
    let user = this.state.user;
    user[key] = value;
    this.setState({ user: user }, next);
  }

  setUserPin(value) {
    this.setUserState('pin', value, this.attemptToRegisterUser);
  }

  goToStep(activeStepNumber, animate) {
    let textColor =
      activeStepNumber === STEP_PIN || activeStepNumber === STEP_ERROR
        ? Palette.consentOffWhite
        : Palette.consentOffBlack;
    let backgroundColor =
      activeStepNumber === STEP_PIN
        ? Palette.consentBlue
        : Palette.consentOffWhite;
    backgroundColor =
      activeStepNumber === STEP_ERROR ? Palette.consentRed : backgroundColor;

    // Is validation necessary at this point?

    Keyboard.dismiss();
    if (animate) {
      this._fadeTextOut(() => {
        this._fadeTextIn(() => {
          this.setState({
            step: activeStepNumber,
            screenBackgroundColor: backgroundColor,
            screenTextColor: textColor
          });
        });
      });
    } else {
      this.setState({ step: activeStepNumber });
    }
  }
  _getPin() {
    let pin = this.state.user.pin;
    if (this.state.user.pin.length > 5) {
      pin = pin.substring(0, 5);
    }
    return pin;
  }

  attemptToRegisterUser() {
    let pin = this._getPin();
    console.log('attemptToRegisterUser');
    console.log(pin.length === 5);
    console.log(this.state.user.username.length);
    console.log(this.state.user.email.length);
    if (
      pin.length === 5 &&
      this.state.user.username.length > 0 &&
      this.state.user.email.length > 0
    ) {
      this.setState({ magicLinkRequested: true }, () => {
        this.requestMagicLink();
        this.goToStep(STEP_MAGIC_LINK, true); // While we wait...
      });
    }
  }

  requestMagicLink() {
    new Promise((resolve) => {
      // AlertIOS.alert('Registering...');
      this.setState({ loading_indicator: true }, resolve);
    })
      .then(() => {
        if (isSensorAvailable) {
          return FingerprintScanner.authenticate({
            description: 'Scan your fingerprint on the device scanner to continue'
          });
        } else {
          return ConsentUser.register(this.state.user, false);
        }
      })
      .then((res) => {
        //clear existing keys before registering user
        return ConsentUser.register(this.state.user, true);
      })
      .then((user) => {
        this.setState({ loading_indicator: false });
      })
      .catch((error) => {
        // AlertIOS.alert(error.message);
        this.setState({ loading_indicator: false });
        console.log(error);
        AlertIOS.alert('Registration unsuccessful...');
        this.clearKeys();
      });
  }

  clearKeys() {
    this.resetRegistration();
    return Crypto.getKeyAliases().then(function (aliases) {
      return Promise.all(
        aliases.map(function (alias) {
          return Crypto.deleteKeyEntry(alias);
        })
      );
    });
  }
  // Called from LifekeyRn when DID is received via Firebase notification
  registrationCallback() {
    this.goToStep(STEP_WAITING_FOR_DID);
  }

  renderInputView(activeStepNumber) {
    switch (activeStepNumber) {
      case STEP_USERNAME:
        return (
          <View style={[style.textInputRow]}>
            <OnboardingTextInputAndroid
              onChangeText={(text) => this.setUserState('username', text)}
              autoCapitalize="sentences"
              fontSize={22}
              inputFadeTransitionValue={this.state.inputFadeTransitionValue}
              onSubmit={() => this.goToStep(STEP_EMAIL, true)}
            />
          </View>
        );
      case STEP_EMAIL:
        return (
          <View style={[style.textInputRow]}>
            <OnboardingTextInputAndroid
              onChangeText={(text) => this.setUserState('email', text)}
              autoCapitalize="none"
              fontSize={24}
              inputFadeTransitionValue={this.state.inputFadeTransitionValue}
              onSubmit={() => this.goToStep(STEP_PIN, true)}
            />
          </View>
        );
      case STEP_PIN:
        return (
          <AuthScreen
            loading_indicator={this.state.loading_indicator}
            pin={this._getPin()}
            onValueChanged={this.boundSetUserPin}
            paddingTop={proportion}
            paddingBottom={proportion / 2}
          />
        );
      case STEP_MAGIC_LINK:
        return (
          <View style={[style.textInputRow]}>
            <View style={style.graphic}>
              <Nachos.Spinner color={Palette.consentBlue} />
            </View>
          </View>
        );
      case STEP_WAITING_FOR_DID:
        return (
          <View style={[style.textInputRow]}>
            <View style={style.graphic}>
              <Nachos.Spinner color={Palette.consentBlue} />
            </View>
          </View>
        );
      case STEP_ERROR:
        return (
          <View style={style.errorContainer}>
            <View
              style={Object.assign({}, style.pinElement, {
                paddingTop: proportion * 2,
                paddingBottom: proportion / 2
              })}
            >
              <HexagonDots
                height={90}
                width={80}
                current={
                  this.state.user.pin.length < 5
                    ? this.state.user.pin.length
                    : 4
                }
              />
            </View>
          </View>
        );
    }
  }

  render() {
    const isPinOrError =
      this.state.step === STEP_PIN || this.state.step === STEP_ERROR;
    const screenTextAlign = isPinOrError ? 'center' : 'left';
    const screenStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      height: this.state.screenHeight,
      backgroundColor: this.state.screenBackgroundColor
    };
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='always'
        style={style.scrollView}
      >
        <View>
          <StatusBar hidden={false} />
          <View style={screenStyle}>
            <View style={style.contentContainer}>
              <Animated.View
                style={Object.assign({}, style.dotContainer, {
                  opacity: this.state.fadeTransitionValue
                })}
              >
                {!isPinOrError && (
                  <Svg
                    style={style.dot}
                    width={5}
                    height={5}
                    strokeWidth={1}
                    stroke="blue"
                  >
                    <Circle
                      cx={2.5}
                      cy={2.5}
                      r={2.5}
                      fill={Palette.consentBlue}
                      strokeWidth={0}
                      stroke="transparent"
                    />
                  </Svg>
                )}
              </Animated.View>
              <View style={style.textContainer}>
                {/* LARGE TEXT */}
                <View style={style.largeTextRow}>
                  <Animated.View
                    style={{
                      opacity: this.state.fadeTransitionValue,
                      marginBottom: this.state.moveTransitionValue
                    }}
                  >
                    <Text
                      style={Object.assign(
                        {},
                        style.registrationFont,
                        style.largeFont,
                        {
                          color: this.state.screenTextColor,
                          textAlign: screenTextAlign
                        }
                      )}
                    >
                      {this.screenData[this.state.step].largeText}
                    </Text>
                  </Animated.View>
                </View>

                {/* SMALL TEXT */}
                <View style={[style.smallTextRow]}>
                  <Animated.View
                    style={{ opacity: this.state.fadeTransitionValue }}
                  >
                    <Text
                      style={Object.assign(
                        {},
                        style.registrationFont,
                        style.smallFont,
                        {
                          color: this.state.screenTextColor,
                          textAlign: screenTextAlign
                        }
                      )}
                    >
                      {this.screenData[this.state.step].smallText}
                    </Text>
                  </Animated.View>
                </View>

                {/* DYNAMIC STEP-SPECIFIC CONTENT */}
                {this.renderInputView(this.state.step)}
              </View>
            </View>

            {/* IF ERROR, RETRY */}
            {this.state.step === STEP_ERROR && (
              <View style={style.retryButtonContainer}>
                <Touchable onPress={() => this.goToStep(STEP_USERNAME, true)}>
                  <Text style={style.retryButton}>Retry</Text>
                </Touchable>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const proportion = 48;

const style = {
  scrollView: {
    flex: 1
  },
  contentContainer: {
    flexDirection: 'row',
    marginBottom: Design.paddingBottom,
    paddingRight: proportion //suspect
  },
  dotContainer: {
    width: proportion * 2
  },
  dot: {
    marginTop: proportion / 2,
    marginLeft: 80
  },
  textContainer: {
    paddingRight: proportion //suspect
  },
  largeTextRow: {
    paddingBottom: Design.paddingBottom * 2
  },
  smallTextRow: {
    paddingBottom: 5
  },
  registrationFont: {
    fontFamily: Design.fonts.registration,
    fontWeight: Design.fontWeights.light
  },
  largeFont: {
    fontSize: 38,
    lineHeight: proportion
  },
  smallFont: {
    fontSize: 15,
    lineHeight: 20
  },
  textInputRow: {
    marginTop: proportion * 2,
    height: 46
  },
  timelineRow: {
    flexDirection: 'column',
    paddingLeft: 35,
    paddingRight: 35
  },
  // pinInput: {
  //   height: 0,
  //   marginLeft: -1000
  // },
  // pinContainer: {
  //   'width': "100%",
  //   'minHeight': 200
  // },
  // pinElement: {
  //   "flex": 1,
  //   'justifyContent': 'center',
  //   'alignItems': 'center'
  // },
  graphic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  retryButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: proportion / 2
  },
  retryButton: {
    minHeight: 25,
    fontSize: 18,
    lineHeight: 22,
    color: Palette.consentOffWhite,
    paddingRight: Design.paddingBottom * 2,
    paddingBottom: Design.paddingBottom * 2
  }
};

Register.contextTypes = {
  // state
  userHasActivated: PropTypes.func
};

export default Register;
