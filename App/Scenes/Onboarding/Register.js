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
  StatusBar
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
import moment from 'moment'

import Touchable from '../../Components/Touchable'

export default class Register extends Scene {

  constructor(props) {
    super(props)
    this.i = 0
    this.state = {
      events: [
        { text: 'Something', time: Date.now() },
        { text: 'Username saved as: Jacques', time: Date.now() },
        { text: 'Magic link sent to', time: moment().format() },
      ]
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
    this._eventTimeline.pushEvent({
      text: 'Event text ' + this.i,
      time: 'test'
    })
    this.i++
  }

  render() {

    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <Grid>
            <Col style={{ flex: 1, paddingLeft: 35, paddingRight: 35, height: Dimensions.get('window').height }}>
              <Row style={{ flex: 2, flexDirection: 'column' }}>
                <EventTimeline
                  ref={(eventTimeline) => this._eventTimeline = eventTimeline}
                />
              </Row>
              <Row style={{ paddingRight: 100, flex: 11, flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 38 }}>Create your username</Text>
              </Row>
              <Row style={{ flex: 2, paddingTop: 25, paddingRight: 90 }}>
                <Text style={{ fontSize: 18 }}>Don't worry, you can change this at any time.</Text>
              </Row>
              <Row style= {{ flex: 8, alignItems: 'center' }}>
                <OnboardingTextInput/>
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

        </Content>
      </Container>
    )
  }
}
