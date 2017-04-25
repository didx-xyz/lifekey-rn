
// external dependencies
import React from "react"
import Svg, { G, Line, Path } from "react-native-svg"
import PropTypes from "prop-types"

const LandlineIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.2 24.2">
	    <Path {...styles.cls1} {...dynamic} d="M27.5,5
			c1.8,0.4,3.2,1.9,3.2,3.7l0,1.7c0,1.4-1.2,2.5-2.6,2.5l-3.8,0c-1.4,0-2.7-1.1-2.7-2.5l0-1C17.8,9,14.2,9,10.4,9.4l0,1
			c0,1.4-1.2,2.5-2.6,2.5l-4,0c-1.4,0-2.5-1.1-2.5-2.5l0-1.7c0-1.8,1.4-3.4,3.2-3.7C11.8,3.5,19.6,3.4,27.5,5z"/>
		<Path {...styles.cls1} {...dynamic} d="M25.7,15.5v10.2c-0.3,1.4-1.1,2.5-2.5,2.5
			H8.9c-1.4,0-2.5-1.1-2.5-2.5V15.5"/>
		<G>
			<Line {...styles.cls1} {...dynamic} x1="10.8" y1="17" x2="12.8" y2="17"/>
			<Line {...styles.cls1} {...dynamic} x1="10.8" y1="20" x2="12.8" y2="20"/>
			<Line {...styles.cls1} {...dynamic} x1="10.8" y1="23.1" x2="12.8" y2="23.1"/>
		</G>
		<G>
			<Line {...styles.cls1} {...dynamic} x1="19.8" y1="17" x2="21.8" y2="17"/>
			<Line {...styles.cls1} {...dynamic} x1="19.8" y1="20" x2="21.8" y2="20"/>
			<Line {...styles.cls1} {...dynamic} x1="19.8" y1="23.1" x2="21.8" y2="23.1"/>
		</G>
		<G>
			<Line {...styles.cls1} {...dynamic} x1="15.3" y1="17" x2="17.3" y2="17"/>
			<Line {...styles.cls1} {...dynamic} x1="15.3" y1="20" x2="17.3" y2="20"/>
			<Line {...styles.cls1} {...dynamic} x1="15.3" y1="23.1" x2="17.3" y2="23.1"/>
		</G>
    </Svg>
  )
}

LandlineIcon.defaultProps = {
  "stroke": "#000"
}

LandlineIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
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

export default LandlineIcon
