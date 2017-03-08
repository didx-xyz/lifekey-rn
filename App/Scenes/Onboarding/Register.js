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
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Row,
  Col
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'
import OnboardingTextInput from '../../Components/OnboardingTextInput'
import EventTimeline from '../../Components/EventTimeline'

import Touchable from '../../Components/Touchable'

export default class Register extends Scene {

  constructor(props) {
    super(props)
    this.i = 0
    this.state = {
      username: ''
    }
  }

  _onAttention() {
    StatusBar.setHidden(true)
  }

  componentWillMount() {
    super.componentWillMount()
    this._onAttention()
  }

  componentDidMount() {
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
    this._eventTimeline.pushEvent("Event text " + this.i)
    this.i++
  }

  _submitUsername() {
    Keyboard.dismiss()
    if (this.state.username) {
      setTimeout(() => {
        this._eventTimeline.pushEvent('Username saved as: ' + this.state.username)
        this.setState({ username: '' })
      }, 300)
    } else {
      alert('Please enter something')
    }

  }


  render() {

    return (
      <Container>
        <Content keyboardShouldPersistTaps="always">
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Grid>
              <Col style={{ flex: 1, paddingLeft: 35, paddingRight: 35, height: Dimensions.get('window').height }}>
                <Row style={{ flex: 2, flexDirection: 'column' }}>
                  <EventTimeline
                    ref={(eventTimeline) => this._eventTimeline = eventTimeline}
                  />
                </Row>
                <Row style={{ flex: 11, flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <Text style={{ fontSize: 38 }}>Create your username</Text>
                </Row>
                <Row style={{ flex: 2, paddingTop: 20 }}>
                  <Text style={{ fontSize: 18 }}>Don't worry, you can change this{'\n'}at any time.</Text>
                </Row>
                <Row style= {{ flex: 8, alignItems: 'center' }}>
                  <OnboardingTextInput
                    onChangeText={(text) => this.setState({ username: text })}
                    value={this.state.username}
                    ref={oti => { this._oti = oti }}
                    onPress={() => this._submitUsername()}
                  />
                </Row>
                <Row style= {{ flex: 4, flexDirection: 'column', justifyContent: 'center' }}>
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
