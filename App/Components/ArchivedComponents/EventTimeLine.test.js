


import 'react-native';
import React from 'react';
import EventTimeline from './EventTimeline'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <EventTimeline />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});



// test('#pushEvent(text)', async () => {
//   const EventTimeline = require('../../App/Components/EventTimelineItem');
//   const data = await EventTimeline.pushEvent()
//   .catch(error => expect(error).toEqual(true));
//
//   expect(data).not.toBe(null);
//
// });
//
// test('#removeEvent(id)', ()  => {
//   const EventTimeline = require('../../App/Components/EventTimelineItem');
//   const data = EventTimeline.removeEvent();
//
//   expect(data).not.toBe(null);
//
// });
//  describe('#removeEvent(id)', () => {
//   it('Testing for async errors using `catch`, Make a connection request with a target user_connection_request_id', async () => {
//     const response = 'User not registered. Cannot send a signed request';
//     const data = await EventTimeline.removeEvent({user_connection_request_id:1})
//     //.catch(error => expect(error).toEqual(response));
//     expect(data).not.toBe(null);
//     //expect(data).toBeDefined()
//   });
// });
