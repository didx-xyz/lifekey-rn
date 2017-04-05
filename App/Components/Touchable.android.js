// external dependencies
import React from "react"
import { TouchableNativeFeedback } from "react-native"

// internal dependencies
import Palette from "../Palette"

const Touchable = function(props) {
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

export default Touchable
