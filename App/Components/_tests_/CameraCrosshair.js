import 'react-native';
import React from 'react';
import Intro from '../Intro';

import renderer from 'react-test-renderer';

test('renders CameraCrosshair correctly', () => {
  const tree = renderer.create(
    <CameraCrosshair />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
