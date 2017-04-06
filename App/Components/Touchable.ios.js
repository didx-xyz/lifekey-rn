// external dependencies
import React from "react"
import { TouchableWithoutFeedback } from "react-native"

const Touchable = function(props) {
  return (
    <TouchableWithoutFeedback
      delayPressIn={0}
      {...props}
    >
      {props.children}
    </TouchableWithoutFeedback>
  )
}

export default Touchable
