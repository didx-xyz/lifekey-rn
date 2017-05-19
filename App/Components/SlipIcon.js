// external dependencies
import React from "react"
import Svg, { Line, Path, G } from "react-native-svg"
import PropTypes from "prop-types"

const SlipIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
      <G>
        <Path {...styles.cls1} {...dynamic} d="M8.1,5.4c0,6.4,0,12.8,0,18.5
          c0.9,0.9,1.8,1.7,2.6,2.6l1.8-1.7l1.8,1.7l1.8-1.7l1.8,1.7l1.8-1.7l1.8,1.7l2.6-2.6V5.4C18.6,5.4,13.4,5.4,8.1,5.4z"/>
        <Line {...styles.cls1} {...dynamic} x1="20.4" y1="19.5" x2="11.6" y2="19.5"/>
        <Line {...styles.cls1} {...dynamic} x1="20.4" y1="15.1" x2="11.6" y2="15.1"/>
        <Line {...styles.cls1} {...dynamic} x1="20.4" y1="10.7" x2="11.6" y2="10.7"/>
      </G>
    </Svg>
  )
}

SlipIcon.defaultProps = {
  "stroke": "#000"
}

SlipIcon.propTypes = {
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

export default SlipIcon
