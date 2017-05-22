// external dependencies
import React from "react"
import Svg, { Line, Path, G } from "react-native-svg"
import PropTypes from "prop-types"

const ThanksIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
      <G  {...styles.cls1} {...dynamic} >
          <Path d='M24.9,22.6H14.1 l-3.8,3.3l0-3.3H7.1c-0.9,0-1.7-0.7-1.7-1.7V7.8c0-0.9,0.7-1.7,1.7-1.7h17.8c0.9,0,1.7,0.7,1.7,1.7v13.1 C26.6,21.8,25.8,22.6,24.9,22.6z'
          />
          <Path d='M10,11.8 c0-1.2,1-2.2,2.2-2.2c1.2,0,2.2,1,2.2,2.2' />
          <Path d='M22,11.8 c0-1.2-1-2.2-2.2-2.2c-1.2,0-2.2,1-2.2,2.2' />
          <Path d='M11.8,15.5 c0,2,1.6,3.6,3.6,3.6h1.3c2,0,3.6-1.6,3.6-3.6' />
      </G>
    </Svg>
  )
}

ThanksIcon.defaultProps = {
  "stroke": "#000"
}

ThanksIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "stroke": "#000000",
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

export default ThanksIcon
