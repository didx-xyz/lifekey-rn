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
  }

  componentDidMount() {
    setInterval(() => {
      Logger.info(`Updating timeline item [${this.props.text}]`, this.constructor.name)
      this.setState({
        fromNow: moment(this.props.timestamp).fromNow()
      }, () => {
        this.forceUpdate()
      })
    }, 60000)
  }

  _fromNow() {
    return moment(this.props.timestamp).fromNow()
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', marginTop: 5 }}>
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
