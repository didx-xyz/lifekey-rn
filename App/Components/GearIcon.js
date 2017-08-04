// external dependencies
import React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import PropTypes from "prop-types"

const GearIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} viewBox='0 0 32 32' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 28.2 29.8" xmlSpace="preserve">
    	<Path  {...styles.cls1} {...dynamic} d="M26.096,19.543l2.452-2.452c0.603-0.603,0.603-1.579,0-2.182
      l-2.452-2.452c-0.289-0.289-0.452-0.682-0.452-1.091V7.899c0-0.852-0.691-1.543-1.543-1.543h-3.468
      c-0.409,0-0.802-0.163-1.091-0.452l-2.452-2.452c-0.603-0.603-1.579-0.603-2.182,0l-2.452,2.452
      c-0.289,0.289-0.682,0.452-1.091,0.452H7.899c-0.852,0-1.543,0.691-1.543,1.543v3.468c0,0.409-0.163,0.802-0.452,1.091
      l-2.452,2.452c-0.603,0.603-0.603,1.579,0,2.182l2.452,2.452c0.289,0.289,0.452,0.682,0.452,1.091v3.468
      c0,0.852,0.691,1.543,1.543,1.543h3.468c0.409,0,0.802,0.163,1.091,0.452l2.452,2.452c0.603,0.603,1.579,0.603,2.182,0
      l2.452-2.452c0.289-0.289,0.682-0.452,1.091-0.452h3.468c0.852,0,1.543-0.691,1.543-1.543v-3.468
      C25.644,20.225,25.807,19.832,26.096,19.543z"/>
      <Circle {...styles.cls1} {...dynamic} cx="16" cy="16" r="6.613"/>
    </Svg>
  )
}

GearIcon.defaultProps = {
  "stroke": "#000"
}

GearIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "stroke": "#000",
    "strokeMiterlimit": 10
  }
}

export default GearIcon
