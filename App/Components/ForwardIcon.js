// external dependencies
import React from "react"
import Svg, { Polyline } from "react-native-svg"
import PropTypes from "prop-types"

const ForwardIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} viewBox="0 0 9.4 17.7">
      <polyline {...styles.cls1} {...dynamic} points="0.5,17.2 8.9,8.7 0.7,0.5"/>
    </Svg>
  )
}

ForwardIcon.defaultProps = {
  "stroke": "#000"
}

ForwardIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "stroke": "#000",
    "strokeLinecap": "round",
    "strokeLinejoin": "round"
  }
}

export default ForwardIcon
