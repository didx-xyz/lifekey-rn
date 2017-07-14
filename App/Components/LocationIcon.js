
import React from "react"
import Svg, { Rect, Polygon } from "react-native-svg"
import PropTypes from "prop-types"

const LocationIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.4 18.4">
      <Rect {...styles.cls1} {...dynamic} x="0.5" y="0.5" width="22.4" height="17.3"/>
      <Polygon {...styles.cls1} {...dynamic} points="6.9,9.2 0.5,15.6 0.5,17.9 3.9,17.9 10.4,11.3 22.9,11.3 22.9,7.1 10.4,7.1 3.9,0.5 0.5,0.5 0.5,2.8 6.9,9.2"/>
    </Svg>
  )
}

LocationIcon.defaultProps = {
  "stroke": "#000"
}

LocationIcon.propTypes = {
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

export default LocationIcon
