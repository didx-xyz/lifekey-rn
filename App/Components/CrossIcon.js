
import React from "react"
import Svg, { Circle, Line } from "react-native-svg"
import PropTypes from "prop-types"

const CrossIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (  
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <Circle {...styles.cls1} {...dynamic} cx="16" cy="16" r="9"/>
      <Line {...styles.cls1} {...dynamic} x1="11.69" y1="11.69" x2="20.31" y2="20.31"/>
      <Line {...styles.cls1} {...dynamic} x1="20.31" y1="11.69" x2="11.69" y2="20.31"/>
    </Svg>
  )
}

CrossIcon.defaultProps = {
  "stroke": "#000"
}

CrossIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "strokeLinecap": "round",
    "strokeLinejoin": "round"
  }
}

export default CrossIcon
