/**
 * Lifekey App
 * @copyright 2016 - 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Palette from '../../Palette'
import Session from '../../Session'
import Logger from '../../Logger'
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Animated,
  InteractionManager
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Row,
  Col
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'
import OnboardingTextInputAndroid from '../../Components/OnboardingTextInputAndroid'
import EventTimeline from '../../Components/EventTimeline'

import Touchable from '../../Components/Touchable'
import DialogAndroid from 'react-native-dialogs'

const DEBUG = false

export default class Register extends Scene {

  constructor(props) {
    super(props)
    this.i = 0
    this.state = {
      textInputValue: '',
      largeText: 'Create your username',
      smallText: 'Don\'t  worry you can change this at any time',
      step: 0,
      moveTransitionValue: new Animated.Value(160),
      fadeTransitionValue: new Animated.Value(1)
    }
  }

  _onAttention() {
    StatusBar.setHidden(true)
  }

  _stepTo(step) {

  }

  componentWillMount() {
    super.componentWillMount()
    this._onAttention()
  }

  componentWillFocus() {
    super.componentWillFocus()
    this._onAttention()
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  _pushTimelineEvent() {
    this._eventTimeline.pushEvent('Event text ' + this.i)
    this.i++
  }

  _changeTexts(largeText, smallText) {
    //  Move
    Animated.timing(                    // Uses easing functions
      this.state.moveTransitionValue,   // The value to drive]
      { toValue: 0 }            // Configuration
    ).start()
    // Fade
    Animated.timing(          // Uses easing functions
      this.state.fadeTransitionValue,    // The value to drive
      { toValue: 0}            // Configuration
    ).start()
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        textInputValue: '',
        largeText: largeText,
        smallText: smallText
      }, () => {
        // change back
        Animated.timing(
          this.state.moveTransitionValue,
          { toValue: 100 }
        ).start()
        // Fade
        Animated.timing(
          this.state.fadeTransitionValue,    // The value to drive
          { toValue: 1}            // Configuration
        ).start()
      })
    })
  }
  _submitUsername() {
    // Close keyboard
    Keyboard.dismiss()

    if (this.state.textInputValue) {
      // If the user entered a username
      // give the keyboard enough time to close
      setTimeout(() => {
        // Push the event to the timeline
        this._eventTimeline.pushEvent('Username saved as: ' + this.state.textInputValue)
        // Clear the username
        this._changeTexts('Please enter your personal email address', 'To set up or recover your key')
      }, 300)
    } else {
      // Otherwise inform them
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
  }

  _tapAway() {
    Keyboard.dismiss()
  }

  _renderUsernameStepCenterContent() {
    return (
      <Row style={{ flex: 13, flexDirection: 'column' }}>

        { /* LARGE TEXT */ }
        <Row style={style.largeTextRow}>
          <Animated.View style= {{
            flex: 1,
            opacity: this.state.fadeTransitionValue,
            marginTop: this.state.moveTransitionValue
          }}>
            <Text style={{ fontSize: 38 }}>{this.state.largeText}</Text>
          </Animated.View>
        </Row>

        { /* SMALL TEXT */ }
        <Row style={[style.smallTextRow]}>
          <Animated.View style={{
            opacity: this.state.fadeTransitionValue,
            flex: 1
          }}>
            <Text style={{ fontSize: 18 }}>{this.state.smallText}</Text>
          </Animated.View>
        </Row>

        { /* TEXT INPUT */}
        <Row style= {[style.textInputRow]}>
          { Platform.OS === 'android' ?
            <OnboardingTextInputAndroid
              onChangeText={(text) => this.setState({ textInputValue: text })}
              value={this.state.textInputValue}
              ref={oti => { this._oti = oti }}
              onSubmit={() => this._submitUsername()}
            /> : null }
        </Row>

      </Row>
    )
  }

  _renderUsernameStepBottomContent() {
    return (
      <Row style= {style.bottomContentRow}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Help</Text>
          </View>
          <View>
            <Touchable
              onPress={() => this._pushTimelineEvent()}
            >
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Text style={{ fontSize: 20 }}>I already have a key</Text>
              </View>
            </Touchable>
          </View>
        </View>
      </Row>
    )
  }

  render() {

    return (
      <Container>
        <Content keyboardShouldPersistTaps="always">
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <TouchableWithoutFeedback onPress={() => this._tapAway()}>
            <Grid>
              <Col style={[style.sceneColumn, { height: Dimensions.get('window').height }]}>
                <Row style={style.timelineRow}>
                  <EventTimeline
                    ref={(eventTimeline) => this._eventTimeline = eventTimeline}
                  />
                </Row>
                { /* center content */ }
                { this._renderUsernameStepCenterContent() }
                { /* bottom content */ }
                { this._renderUsernameStepBottomContent() }

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
    paddingLeft: 35,
    paddingRight: 35
  },
  textInputRow: {
    flex: 8,
    alignItems: 'center',
    backgroundColor: DEBUG ? 'blue' : null
  },
  timelineRow: {
    flex: 2,
    flexDirection: 'column',
    backgroundColor: DEBUG ? 'green' : null
  },
  bottomContentRow: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: DEBUG ? 'red' : null
  },
  smallTextRow: {
    flex: 2,
    marginTop: 5,
    backgroundColor: DEBUG ? 'orange' : null
  },
  largeTextRow: {
    flex: 11,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: DEBUG ? 'purple' : null
  }
})
