
import React from "react"
import Svg, { Rect, Path, Polyline } from "react-native-svg"
import PropTypes from "prop-types"

const LocationFlagIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }
  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <Rect x="3.42" y="6.28" width="25.17" height="19.44" rx="1.5" ry="1.5" {...styles.cls1} {...dynamic}/>
      <Polyline {...styles.cls1} {...dynamic} points="28.298,13.671 15.508,13.671 7.391,6.5"/>
      <Polyline {...styles.cls1} {...dynamic} points="7.391,25.5 15.508,18.329 28.298,18.329"/>
      <Polyline {...styles.cls1} {...dynamic} points="3.702,8.96 11.688,16 3.702,23.04"/>
    </Svg>
  )
}

LocationFlagIcon.defaultProps = {
  "stroke": "#000"
}

LocationFlagIcon.propTypes = {
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

export default LocationFlagIcon
