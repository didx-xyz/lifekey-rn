// external dependencies
import React from "react"
import Svg, { Circle, Line, Polyline } from "react-native-svg"
import PropTypes from "prop-types"

const InfoIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.2 24.2">
      <Circle {...styles.cls1} {...dynamic} cx="12.1" cy="12.1" r="11.6" />
      <Line {...styles.cls2} {...dynamic} x1="9.9" y1="18.1" x2="14" y2="18.1" />
      <Line {...styles.cls3} {...dynamic} x1="12.1" y1="6.4" x2="12.1" y2="6.4" />
      <Polyline {...styles.cls2} {...dynamic} points="12.4,18.1 12.4,9.7 10.2,9.7" />
    </Svg>
  )
}

InfoIcon.defaultProps = {
  "stroke": "#000"
}

InfoIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
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

export default InfoIcon
