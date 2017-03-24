/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import EventTimelineItem from './EventTimelineItem'
import Session from '../Session'
import Config from '../Config'
import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet
} from 'react-native'
import { Footer } from 'native-base'

export default class EventTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timelineEvents: Session.getState().timelineEvents || []
    }
  }

  pushEvent(text) {
    let events = this.state.timelineEvents || []
    events.push({
      text: text,
      timestamp: new Date()
    })

    this.setState({
      timelineEvents: events
    }, () => {
      Session.update({
        timelineEvents: events
      })
    })
  }

  render() {
    const timelineEvents = this.state.timelineEvents
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollView => this._scrollView = scrollView}
        style={{ flex: 1 }}
        contentContainerStyle={style.scrollView} >
          <View style={{ flexDirection: 'column' }}>
            { timelineEvents ?
            timelineEvents.map((x, i) =>
              <EventTimelineItem key={i} text={x.text} timestamp={x.timestamp}/>
            ) : null }
          </View>
      </ScrollView>
    )
  }
}


const style = StyleSheet.create({
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  }
})
