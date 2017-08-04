
import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';
import EventTimelineItem from './EventTimelineItem'

test('renders correctly', () => {
  const tree = renderer.create(
    <EventTimelineItem />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});


//import MockStorage from '../../App/Components/MockStorage'
// jest.dontMock('../../App/Components/EventTimelineItem');
//
// // const cache = {}
// // const AsyncStorage = new MockStorage(cache)
//
//
// //jest.setMock("AsyncStorage", AsyncStorage)
//
// jest.useFakeTimers();
//
// test('waits 6 second before ending', () => {
// //  const EventTimelineItem = require('../../App/Components/EventTimelineItem');
//    //EventTimelineItem.setInterval();
//
//   expect(setInterval.mock.calls.length).toBe(1);
//   expect(setInterval.mock.calls[0]).toBe(6000);
// });
//
