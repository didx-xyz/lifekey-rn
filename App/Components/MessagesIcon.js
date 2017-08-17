// external dependencies
import React from "react"
import Svg, { Line, Circle, G } from "react-native-svg"
import PropTypes from "prop-types"

import Palette from "../Palette"

const MessagesIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
      <G>
        <Line {...styles.cls1} {...dynamic} x1="4.676" y1="5.598" x2="4.676" y2="26.402"/>
        <Line {...styles.cls1} {...dynamic} x1="29" y1="8.535" x2="8.668" y2="8.535"/>
        <Circle {...styles.cls1} {...styles.cls2} {...dynamic} cx="4.676" cy="8.535" r="1.676"/>
        <Line {...styles.cls1} {...dynamic} x1="29" y1="13.512" x2="8.668" y2="13.512"/>
        <Circle {...styles.cls1} {...styles.cls2} {...dynamic} cx="4.676" cy="13.512" r="1.676"/>
        
        <Line {...styles.cls1} {...dynamic} x1="17.239" y1="18.488" x2="8.668" y2="18.488"/>
        <Circle {...styles.cls1} {...styles.cls2} {...dynamic} cx="4.676" cy="18.488" r="1.676"/>
        
        <Line {...styles.cls1} {...dynamic} x1="23.183" y1="23.465" x2="8.668" y2="23.465"/>
        <Circle {...styles.cls1} {...styles.cls2} {...dynamic} cx="4.676" cy="23.465" r="1.676"/>
      </G>
    </Svg>
  )
}

MessagesIcon.defaultProps = {
  "stroke": Palette.consentGrayDark
}

MessagesIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "stroke": "#000000",
    "strokeMiterlimit": 10
  },
  "cls2": {
    "fill": Palette.consentGrayDark
  }
  // ,
  // "cls3": {
  //   "fill": "none",
  //   "strokeLinecap": "round",
  //   "strokeLinejoin": "round",
  //   "strokeWidth": 2
  // }
}

export default MessagesIcon
