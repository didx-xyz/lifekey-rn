/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import Palette from '../Palette'
import Logger from '../Logger'

import moment from 'moment'

export default class EventTimelineItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fromNow: moment(props.timestamp).fromNow()
    }
    this.keepUpdating = true
  }

  componentDidMount() {
    /* This has to be handled more safely as the timer
       will continue after the component is unmounted
       which will lead to a crash
       https://facebook.github.io/react-native/docs/timers.html
       */
    setInterval(() => {
      if (this.keepUpdating) {
        Logger.info(`Updating timeline item fromNow value ['${this.props.text}']`, this.constructor.name)
        this.setState({
          fromNow: moment(this.props.timestamp).fromNow()
        }, () => {
          this.forceUpdate()
        })
      }
    }, 60000)
  }

  componentWillUnmount() {
    this.keepUpdating = false
  }

  _fromNow() {
    return moment(this.props.timestamp).fromNow()
  }

  render() {
    return (
      <View style={style.wrappingView}>
        <View>
          <Text>{this.props.text}</Text>
        </View>
        <View>
          <Text style={{ color: Palette.consentGrayDark, fontSize: 10 }}>{this._fromNow()}</Text>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  wrappingView: {
    flexDirection: 'column',
    height: 40,
    padding: 2
  }
})
