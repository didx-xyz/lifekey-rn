
// external dependencies
import React from "react"
import Svg, { G, Polyline, Path } from "react-native-svg"

const EnvelopeIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.2 24.2">
	    <G>
        <Path {...styles.cls1} {...dynamic} d="M28.8,22.5
          c0,1.1-0.9,2-2,2H5.5c-1.3,0-2.3-1.1-2.3-2.4V9.5c0-1.1,0.9-2,2-2h21.6c1.1,0,2,0.9,2,2V22.5z"/>
        <Polyline {...styles.cls1} {...dynamic} points="28.2,8.1 16.5,17.4 3.8,8.1   "/>
      </G>
    </Svg>
  )
}

EnvelopeIcon.defaultProps = {
  "stroke": "#000"
}

EnvelopeIcon.propTypes = {
  "width": React.PropTypes.number.isRequired,
  "height": React.PropTypes.number.isRequired,
  "stroke": React.PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "strokeMiterlimit": 10
  },
  "cls2": {
    "fill": "none",
    "strokeLinecap": "round",
    "strokeLinejoin": "round"
  },
  "cls3": {
    "fill": "none",
    "strokeLinecap": "round",
    "strokeLinejoin": "round",
    "strokeWidth": 2
  }
}

export default EnvelopeIcon
