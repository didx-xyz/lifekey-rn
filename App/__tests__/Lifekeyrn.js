import 'react-native';
import React from 'react';
import Lifekeyrn from '../Lifekeyrn';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
  <Lifekeyrn />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
