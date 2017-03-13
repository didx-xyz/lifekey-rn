import React from 'react'

import {
  TouchableWithoutFeedback
} from 'react-native'

export default function(props) {
  return (
    <TouchableWithoutFeedback
      delayPressIn={0}
      {...props}
    >
      {props.children}
    </TouchableWithoutFeedback>
  )
}
