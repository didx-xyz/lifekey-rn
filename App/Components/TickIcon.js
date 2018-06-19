// external dependencies
import React from "react"
import Svg, { Polyline, Circle } from "react-native-svg"
import PropTypes from "prop-types"

const TickIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke,
    "color": props.stroke,
    "fill": props.fill
  }

  console.log("TICK WIDTH: ", props.width)
  console.log("TICK HEIGHT: ", props.height)

  return (
    <Svg width={props.width} height={props.height} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
      <Circle {...dynamic} cx="16" cy="16" r="9"/>
      <Polyline {...dynamic} points="20.5,12.786 14.714,19.857 11.5,16.643"/>
    </Svg>
  )
}

TickIcon.defaultProps = {
  "stroke": "blue",
  "fill": "none"
}

TickIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "black",
    "strokeMiterlimit": 10
  },
  "cls2": {
    "fill": "none",
    "strokeLinecap": "round",
    "strokeLinejoin": "round"
  },
  "cls3": {
    "fill": "none",
    "strokeLinecap": "round",
    "strokeLinejoin": "round",
    "strokeWidth": 2
  }
}

export default TickIcon



