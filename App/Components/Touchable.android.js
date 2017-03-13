import React from 'react'

import {
  TouchableNativeFeedback
} from 'react-native'

import Palette from '../Palette'

export default function(props) {
  const background = TouchableNativeFeedback.Ripple(
    Palette.consentGrayLight, true
  )

  return (
    <TouchableNativeFeedback
      background={background}
      delayPressIn={0}
      {...props}
    >
      {props.children}
    </TouchableNativeFeedback>
  )
}
