/**
 * Lifekey App
 * @copyright 2016 - 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Palette from '../../Palette'

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

import BackButton from '../../Components/BackButton'
import OnboardingTextInputAndroid from '../../Components/OnboardingTextInputAndroid'
import EventTimeline from '../../Components/EventTimeline'
import Touchable from '../../Components/Touchable'
import DialogAndroid from 'react-native-dialogs'

const DEBUG = false

export default class Register extends Scene {

  constructor(props) {
    super(props)
    this.i = 0
    this._steps = [
      {
        largeText: 'Create your username',
        smallText: 'Don\'t worry you can change this at any time',
        bottomRightButton: 'I already have a key'
      },
      {
        largeText: 'Please enter your personal email address',
        smallText: 'To set up or recover your key',
        bottomRightButton: null
      },
      {
        largeText: 'Check your mail for a magic link',
        smallText: 'The link will be valid for 24 hours',
        bottomRightButton: 'Resend link'
      }
    ]
    this.state = {
      step: 0, // The beginning
      textInputValue: '',
      username: null,
      email: null,
      largeText: this._steps[0].largeText,
      smallText: this._steps[0].smallText,
      moveTransitionValue: new Animated.Value(props.screenHeight / 6),
      fadeTransitionValue: new Animated.Value(1)
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
    Animated.timing(
      this.state.moveTransitionValue,
      { toValue: 0 }
    ).start()
    // Fade
    Animated.timing(
      this.state.fadeTransitionValue,
      { toValue: 0 }
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
          this.state.fadeTransitionValue,
          { toValue: 1 }
        ).start()
      })
    })
  }

  _submitText(text) {
    switch (this.state.step) {

    // username -> email
    case 0:
      // If a username was entered
      if (text) {

        Keyboard.dismiss()

        // Give the keyboard time to close
        setTimeout(() => {
          this._eventTimeline.pushEvent(`Username saved as: ${text}`)
          this._changeTexts(this._steps[1].largeText, this._steps[1].smallText)
        }, 300)

        // Update state to reflect we are on the 2nd step now
        this.setState({
          step: 1,
          username: text
        }, () => {
          // Clear TextInput value
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


    // email -> magic link
    case 1:
      if (text) {

        Keyboard.dismiss()

        setTimeout(() => {
          this._eventTimeline.pushEvent(`Email saved as: ${text}`)
          this._changeTexts(this._steps[2].largeText, this._steps[2].smallText)
        }, 300)

        // Update the state to show we are on the 3rd step
        this.setState({
          step: 2,
          email: text
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
    // Magic link
    case 2:
      break
    }
  }

  render() {

    return (
      <Container>
        <Content keyboardShouldPersistTaps="always">
          <BackButton />
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Grid>
              <Col style={[style.sceneColumn, { flex: 1, height: this.props.screenHeight }]}>
                <Row style={style.timelineRow}>
                  <EventTimeline
                    ref={(eventTimeline) => this._eventTimeline = eventTimeline}
                  />
                </Row>
                { /* center content */ }
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
                  <Row style= {[
                    style.textInputRow,
                    { backgroundColor: this.state.step <= 1 ? null : Palette.consentGrayLight }
                  ]}>
                    { this.state.step <= 1 ?
                        <OnboardingTextInputAndroid
                          onChangeText={(text) => this.setState({ textInputValue: text })}
                          value={this.state.textInputValue}
                          ref={oti => { this._oti = oti }}
                          onSubmit={() => this._submitText(this.state.textInputValue)}
                        />
                      :
                        null }
                  </Row>
                </Row>

                { /* Footer content */ }
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
    // paddingLeft: 35,
    // paddingRight: 35
  },
  textInputRow: {
    flex: 8,
    alignItems: 'center',
    backgroundColor: DEBUG ? 'blue' : null,
    paddingLeft: 35,
    paddingRight: 35
  },
  timelineRow: {
    flex: 2,
    flexDirection: 'column',
    backgroundColor: DEBUG ? 'green' : null,
    paddingLeft: 35,
    paddingRight: 35
  },
  bottomContentRow: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: DEBUG ? 'red' : null,
    paddingLeft: 35,
    paddingRight: 35
  },
  smallTextRow: {
    flex: 2,
    marginTop: 5,
    backgroundColor: DEBUG ? 'orange' : null,
    paddingLeft: 35,
    paddingRight: 35
  },
  largeTextRow: {
    flex: 11,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: DEBUG ? 'purple' : null,
    paddingLeft: 35,
    paddingRight: 35
  }
})
