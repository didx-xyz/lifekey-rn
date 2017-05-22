// external dependencies
import React from "react"
import Svg, { G, Path } from "react-native-svg"
import PropTypes from "prop-types"

const GearIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} viewBox='0 0 24 24' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 28.2 29.8" xmlSpace="preserve">
    	<Path  {...styles.cls1} {...dynamic} d="M20 13.44v-2.88l-1.8-.3c-.1-.397-.3-.794-.6-1.39l1.1-1.49-2.1-2.088-1.5 1.093c-.5-.298-1-.497-1.4-.596L13.5 4h-2.9l-.3 1.79c-.5.098-.9.297-1.4.595L7.4 5.292 5.3 7.38l1 1.49c-.3.496-.4.894-.6 1.39l-1.7.2v2.882l1.8.298c.1.497.3.894.6 1.39l-1 1.492 2.1 2.087 1.5-1c.4.2.9.395 1.4.594l.3 1.79h3l.3-1.79c.5-.1.9-.298 1.4-.596l1.5 1.092 2.1-2.08-1.1-1.49c.3-.496.5-.993.6-1.39l1.5-.3zm-8 1.492c-1.7 0-3-1.292-3-2.982 0-1.69 1.3-2.98 3-2.98s3 1.29 3 2.98-1.3 2.982-3 2.982z"/>
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
