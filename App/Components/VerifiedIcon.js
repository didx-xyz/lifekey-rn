// external dependencies
import React from "react"
import Svg, { Path, Polyline } from "react-native-svg"
import PropTypes from "prop-types"

const VerifiedIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 28.2 29.8" xmlSpace="preserve">
      <Path {...styles.cls1} {...dynamic} d="M14.1,2L3.5,5.6c0,0,0,8.9,0,11c0,8.5,10.6,11.2,10.6,11.2s10.6-2.7,10.6-11.2c0-2.1,0-11,0-11L14.1,2z"/>
      <Polyline {...styles.cls1} {...dynamic} points="7.9,14.3 11.9,18.3 20.3,9.8"/>
    </Svg>
  )
}

VerifiedIcon.defaultProps = {
  "stroke": "#000"
}

VerifiedIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fillRule": "evenodd",
    "clipRule": "evenodd",
    "fill": "none",
    "stroke": "#000000",
    "strokeMiterlimit": 10
  }
}

export default VerifiedIcon
