// external dependencies
import React from "react"
import Svg, { Line, Path, G, Rect } from "react-native-svg"
import PropTypes from "prop-types"

const TrashIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
      <G  {...styles.cls1} {...dynamic} >
          <Rect x="7.3" y="7.3" class="st0" width="17.4" height="20.7"/>
          <Rect x="11.4" y="4" class="st0" width="9.1" height="3.3"/>
          <Line class="st0" x1="4" y1="7.3" x2="28" y2="7.3"/>
          <Line class="st0" x1="11.4" y1="11.9" x2="11.4" y2="23.4"/>
          <Line class="st0" x1="16" y1="11.9" x2="16" y2="23.4"/>
          <Line class="st0" x1="20.6" y1="11.9" x2="20.6" y2="23.4"/>
      </G>
    </Svg>
  )
}

TrashIcon.defaultProps = {
  "stroke": "#000"
}

TrashIcon.propTypes = {
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

export default TrashIcon
