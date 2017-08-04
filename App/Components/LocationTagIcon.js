
import React from "react"
import Svg, { G, Circle, Path } from "react-native-svg"
import PropTypes from "prop-types"

const LocationTagIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <G>
        <Path {...styles.cls1} {...dynamic} d="M24.966,11.966
          C24.966,16.917,16,29,16,29S7.034,16.917,7.034,11.966C7.034,7.014,11.048,3,16,3S24.966,7.014,24.966,11.966z"/>
          <Circle {...styles.cls1} {...dynamic} cx="16" cy="11.506" r="3.555"/>
      </G>
    </Svg>
  )
}

LocationTagIcon.defaultProps = {
  "stroke": "#000"
}

LocationTagIcon.propTypes = {
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

export default LocationTagIcon
