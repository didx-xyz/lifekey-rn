import 'react-native'
import React from 'react'
import Lifekeyrn from '../App/Lifekeyrn'

jest.mock('react-native-camera')

import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(
    <Lifekeyrn />
  )
  
  expect(tree).toMatchSnapshot()
})
