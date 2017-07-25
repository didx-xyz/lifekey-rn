// external dependencies
import React from "react"
import {TouchableNativeFeedback} from "react-native"

// internal dependencies
import Palette from "../Palette"

const Touchable = function(props) {

  var can_use_native = TouchableNativeFeedback.canUseNativeForeground()
  
  return (
    <TouchableNativeFeedback useForeground={can_use_native}
                             ripple={{borderless: can_use_native}}
                             background={can_use_native ? TouchableNativeFeedback.Ripple(Palette.consentGrayLight, true) : null}
                             delayPressIn={0}
                             {...props}>
      {props.children}
    </TouchableNativeFeedback>
  )
}

export default Touchable
