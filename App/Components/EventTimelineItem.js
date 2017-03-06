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

export default class EventTimelineItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'green' }}>
        <View>
          <Text>{this.props.text}</Text>
        </View>
        <View>
          <Text>{this.props.time}</Text>
        </View>
      </View>
    )
  }
}
