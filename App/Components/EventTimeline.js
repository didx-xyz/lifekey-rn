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

  pushEvent(text) {
    let events = this.state.events
    events.push(text)
    this.setState({
      events: events
    }, () => {
      setTimeout(() => {
        // Prevent this happening too early
        this._scrollView.scrollToEnd({ animated: true })
      }, 0)
    })
  }

  render() {
    return (
      <ScrollView
        ref={scrollView => {this._scrollView = scrollView}}
        style={{ flex: 1 }}>
        { this.state.events.map((text, i) =>
          <EventTimelineItem key={i} text={text}/>
        )}
      </ScrollView>
    )
  }
}
