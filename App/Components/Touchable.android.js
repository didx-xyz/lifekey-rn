// external dependencies
import React from "react"
import {TouchableNativeFeedback} from "react-native"

// internal dependencies
import Palette from "../Palette"

const Touchable = function(props) {
  var can_use_native = TouchableNativeFeedback.canUseNativeForeground()
  var native_or_ripple = !can_use_native || props.noRipple
  return (
    <TouchableNativeFeedback hitSlop={props.hitSlop}
                             useForeground={can_use_native}
                             ripple={{borderless: native_or_ripple ? false : true}}
                             background={native_or_ripple ? null : TouchableNativeFeedback.Ripple(Palette.consentGrayLight, true)}
                             delayPressIn={0}
                             {...props}>
      {props.children}
    </TouchableNativeFeedback>
  )
}

export default Touchable


