/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import EventTimelineItem from './EventTimelineItem'

import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView
} from 'react-native'

export default class EventTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: this.props.events || []
    }

  }

  pushEvent(event) {
    if (! (typeof event === 'object')) {
      throw 'Event must be an object'
    }
    // this._scrollView.scrollToEnd({ animated: true }) NOT AVAILABLE IN 0.40
    let events = this.state.events
    events.push(event)
    this.setState({
      events: events
    })
  }

  render() {
    return (
      <ScrollView
        ref={scrollView => {this._scrollView = scrollView}}
        style={{ flex: 1, backgroundColor: 'red' }}>
        { this.state.events.map((x) =>
          <EventTimelineItem text={x.text} time={x.time}/>
        )}
      </ScrollView>
    )
  }
}
