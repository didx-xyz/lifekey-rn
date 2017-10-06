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
        <Circle {...styles.cls1} {...dynamic} cx="16" cy="16" r="9"/>
        <Path {...styles.cls1} {...dynamic} d="M18.915,13.512
          c0,2.575-2.915,1.838-2.915,5.151"/>
        <Path {...styles.cls1} {...dynamic} d="M13.085,13.512
          c0-1.61,1.305-2.915,2.915-2.915s2.915,1.305,2.915,2.915"/>
        <Circle {...styles.cls1} {...dynamic} cx="16.03" cy="20.874" r="0.528"/>

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
