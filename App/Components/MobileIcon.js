// external dependencies
import React from "react"
import Svg, { Line, Path } from "react-native-svg"
import PropTypes from "prop-types"

const MobileIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.2 26.2">
      <Path {...styles.cls1} {...dynamic} d="M22.4,22.7c0,0.5-0.4,0.9-0.9,0.9l-11.2,0
        c-0.5,0-0.9-0.4-0.9-0.9l0-13.6c0-0.5,0.4-0.9,0.9-0.9l11.2,0c0.5,0,0.9,0.4,0.9,0.9L22.4,22.7z"/>
      <Path {...styles.cls1} {...dynamic} d="M24.2,25.9c0,1.4-1.2,2.6-2.6,2.6l-11.2,0
        c-1.4,0-2.6-1.2-2.6-2.6l0-19.8c0-1.4,1.2-2.6,2.6-2.6l11.2,0c1.4,0,2.6,1.2,2.6,2.6L24.2,25.9z"/>
      <Line {...styles.cls1} {...dynamic} x1="13.4" y1="6.1" x2="18.6" y2="6.1"/>
      <Line {...styles.cls1} {...dynamic} x1="15.4" y1="26.1" x2="16.6" y2="26.1"/>
      <Line {...styles.cls1} {...dynamic} x1="18.3" y1="26.1" x2="19.5" y2="26.1"/>
      <Line {...styles.cls1} {...dynamic} x1="12.4" y1="26.1" x2="13.7" y2="26.1"/>
    </Svg>
  )
}

MobileIcon.defaultProps = {
  "stroke": "#000"
}

MobileIcon.propTypes = {
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

export default MobileIcon
