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
  StyleSheet
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Col,
  Row
} from 'native-base'

import BackButton from '../../Components/BackButton'
import Touchable from '../../Components/Touchable'
import EventTimeline from '../../Components/EventTimeline'

export default class Unlocked extends Scene {

  componentDidMount() {
    setTimeout(() => {
      this._eventTimeline.pushEvent('Identity Document photo added to your MyData')
    }, 100)
  }

  render() {
    return (
      <Container>
        <Content>
          <BackButton onPress={() => true()}/>
          <Grid>
            <Col style={{ flex: 1, height: this.props.screenHeight }}>
              <Row style={style.firstRow}>
                <EventTimeline ref={(eventTimeline) => this._eventTimeline = eventTimeline}/>
              </Row>
              <Row style={style.secondRow}>
                <Text style={{ fontSize: 32 }}>Unlocked!</Text>
              </Row>
              <Row style={style.thirdRow}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>This page will lead to the homepage. "Back to Start" will just restart this prototype.</Text>
              </Row>
              <Row style={style.fourthRow}>
                <Touchable onPress={() => alert('todo')}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, color: 'white'}}>Back to start</Text>
                  </View>
                </Touchable>
              </Row>
            </Col>
          </Grid>
        </Content>
      </Container>
    )
  }
}

const style = StyleSheet.create({
  firstRow: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 50,
    paddingRight: 50
  },
  secondRow: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thirdRow: {
    flex: 8,
    justifyContent: 'center',
    paddingTop: 50,
    paddingLeft: 60,
    paddingRight: 60
  },
  fourthRow: {
    flex: 4,
    backgroundColor: Palette.consentBlue
  }
})