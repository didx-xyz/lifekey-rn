import React from 'react'

import {
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Platform
} from 'react-native'

import Palette from '../Palette'

export default function(props) {
  if (Platform.OS == "android") {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(Palette.consentGrayLight, true)}
        delayPressIn={0}
        {...props}
      >
        {props.children}
      </TouchableNativeFeedback>
    )
  }

  return (
    <TouchableWithoutFeedback
      delayPressIn={0}
      {...props}
    >
      {props.children}
    </TouchableWithoutFeedback>
  )
}
