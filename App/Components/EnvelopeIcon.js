
// external dependencies
import React from "react"
import Svg, { G, Polyline, Path } from "react-native-svg"
import PropTypes from "prop-types"

const EnvelopeIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <G>
        <Path {...styles.cls1} {...dynamic} d="M28.53,22a2.31,2.31,0,0,1-2.32,2.32H5.71A2.23,2.23,0,0,1,3.47,22V10A2.19,2.19,0,0,1,5.79,7.65H26.21A2.19,2.19,0,0,1,28.53,10V22Z"/>
      </G>
      <Polyline {...styles.cls1} {...dynamic} points="27.774,8.245 16.459,17.22 4.226,8.245"/>
    </Svg>
  )
}

EnvelopeIcon.defaultProps = {
  "stroke": "#000"
}

EnvelopeIcon.propTypes = {
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

export default EnvelopeIcon
