
import React from "react"
import Svg, { Line } from "react-native-svg"
import PropTypes from "prop-types"

const PlusIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (  
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <Line {...styles.cls1} {...dynamic} x1="16" y1="8" x2="16" y2="24"/>
      <Line {...styles.cls1} {...dynamic} x1="24" y1="16" x2="8" y2="16"/>
    </Svg>
  )
}

PlusIcon.defaultProps = {
  "stroke": "#000"
}

PlusIcon.propTypes = {
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

export default PlusIcon
