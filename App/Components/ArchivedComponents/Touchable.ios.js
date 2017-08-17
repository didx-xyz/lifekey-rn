// external dependencies
import React from "react"
import { TouchableOpacity } from "react-native"

const Touchable = function(props) {
  return (
    <TouchableOpacity
      delayPressIn={0}
      {...props}
    >
      {props.children}
    </TouchableOpacity>
  )
}

export default Touchable
