
import React from "react"
import Svg, { Rect, Path, Polyline } from "react-native-svg"
import PropTypes from "prop-types"

const LocationFlagIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }
  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <Path {...styles.cls1} {...dynamic} d="M27.5,6.958c0.276,0,0.5,0.224,0.5,0.5v17.083c0,0.276-0.224,0.5-0.5,0.5h-23
        c-0.276,0-0.5-0.224-0.5-0.5V7.458c0-0.276,0.224-0.5,0.5-0.5H27.5 M27.5,5.958h-23c-0.828,0-1.5,0.672-1.5,1.5v17.083
        c0,0.828,0.672,1.5,1.5,1.5h23c0.828,0,1.5-0.672,1.5-1.5V7.458C29,6.63,28.328,5.958,27.5,5.958L27.5,5.958z"/>
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
