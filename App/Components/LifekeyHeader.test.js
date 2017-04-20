
import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';
import LifekeyHeader from './LifekeyHeader'

test('renders correctly', () => {
  const tree = renderer.create(
    <LifekeyHeader />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
