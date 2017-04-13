// external dependencies
import React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import PropTypes from "prop-types"

const HelpIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 28.2 29.8" xmlSpace="preserve">
    	<Circle {...styles.cls1} {...dynamic} cx="14.1" cy="14.9" r="11.6"/>
    	<Path {...styles.cls1} {...dynamic} d="M13.4,17.8c0-0.8,0.1-1.3,0.2-1.6s0.5-0.7,1-1.2c0.6-0.7,1.1-1.2,1.4-1.6c0.3-0.4,0.4-1,0.4-1.7c0-0.8-0.2-1.3-0.6-1.7
    		c-0.4-0.4-1-0.6-1.7-0.6c-0.7,0-1.2,0.2-1.7,0.6c-0.4,0.4-0.6,0.9-0.6,1.6h-1l0-0.1c0-1,0.3-1.7,0.9-2.3c0.6-0.6,1.4-0.8,2.4-0.8
    		c1,0,1.9,0.3,2.5,0.9c0.6,0.6,0.9,1.4,0.9,2.4c0,0.8-0.2,1.5-0.6,2.1c-0.4,0.6-0.9,1.3-1.7,1.9c-0.4,0.3-0.6,0.6-0.7,0.9
    		c-0.1,0.3-0.1,0.7-0.1,1.2H13.4z M14.6,21.4h-1.2V20h1.2V21.4z"/>
    </Svg>
  )
}

HelpIcon.defaultProps = {
  "stroke": "#000"
}

HelpIcon.propTypes = {
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

export default HelpIcon
