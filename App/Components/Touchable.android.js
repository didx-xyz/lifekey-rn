// external dependencies
import React from "react"
import { TouchableNativeFeedback } from "react-native"

// internal dependencies
import Palette from "../Palette"

const Touchable = function(props) {
  const background = TouchableNativeFeedback.Ripple(
    Palette.consentGrayLight, true
  )

  if(props.noRipple){
  	return (
	    <TouchableNativeFeedback hitSlop={props.hitSlop} background={null} delayPressIn={0} {...props} >
	      {props.children}
	    </TouchableNativeFeedback>
	  )
  }
  
  return (
    <TouchableNativeFeedback hitSlop={props.hitSlop} ripple={{ "borderless": true }} background={background} delayPressIn={0} {...props} >
      {props.children}
    </TouchableNativeFeedback>
  )

}

export default Touchable


