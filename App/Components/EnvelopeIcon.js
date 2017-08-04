
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
        <Path {...styles.cls1} {...dynamic} d="M26.593,8.333C27.487,8.333,28,8.846,28,9.741v12.519c0,0.789-0.618,1.407-1.407,1.407H5.324
          C4.544,23.667,4,23.088,4,22.259V9.741c0-0.894,0.513-1.407,1.407-1.407H26.593 M26.593,7.333H5.407C3.963,7.333,3,8.296,3,9.741
          v12.519c0,1.34,0.963,2.407,2.324,2.407h21.269c1.34,0,2.407-1.067,2.407-2.407V9.741C29,8.296,28.037,7.333,26.593,7.333
          L26.593,7.333z"/>
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
