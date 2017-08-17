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
          <Path d="M25.774,24.407
            h-9.642l-5.124,4.658l0-4.658H6.205c-1.463,0-2.649-1.186-2.649-2.649V7.207c0-1.463,1.186-2.649,2.649-2.649h19.569
            c1.463,0,2.649,1.186,2.649,2.649v14.552C28.423,23.222,27.237,24.407,25.774,24.407z"/>
          <Path d="M9.529,12.636
            c0-1.298,1.052-2.349,2.349-2.349c1.297,0,2.349,1.051,2.349,2.349"/>
          <Path d="M22.45,12.636
            c0-1.298-1.052-2.349-2.349-2.349c-1.297,0-2.349,1.051-2.349,2.349"/>
          <Path d="M11.081,15.85
            c0,2.601,2.128,4.73,4.729,4.73h0.359c2.601,0,4.73-2.128,4.73-4.73"/>  
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
