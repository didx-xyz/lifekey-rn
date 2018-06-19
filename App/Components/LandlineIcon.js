
// external dependencies
import React from "react"
import Svg, { G, Line, Path } from "react-native-svg"
import PropTypes from "prop-types"

const LandlineIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <Path {...styles.cls1} {...dynamic} d="M26.174,6.289
        C27.735,6.608,29,7.986,29,9.579l0,1.471c0,1.235-1.026,2.241-2.261,2.241l-3.391,0c-1.235,0-2.417-1.006-2.417-2.241l0-0.897
        c-3.352-0.332-6.508-0.333-9.862,0l0,0.897c0,1.235-1.026,2.241-2.261,2.241l-3.567,0C4.006,13.291,3,12.284,3,11.049l0-1.471
        c0-1.593,1.265-2.971,2.826-3.289C12.327,4.964,19.219,4.872,26.174,6.289z"/>
      <Path {...styles.cls1} {...dynamic} d="M24.517,15.532v8.966
        c-0.273,1.244-0.998,2.241-2.241,2.241H9.724c-1.244,0-2.241-0.998-2.241-2.241v-8.966"/>
      <G>
        
          <Line {...styles.cls1} {...dynamic} x1="11.45" y1="16.877" x2="13.174" y2="16.877"/>
        
          <Line {...styles.cls1} {...dynamic} x1="11.45" y1="19.567" x2="13.174" y2="19.567"/>
        
          <Line {...styles.cls1} {...dynamic} x1="11.45" y1="22.257" x2="13.174" y2="22.257"/>
      </G>
      <G>
        
          <Line {...styles.cls1} {...dynamic} x1="19.362" y1="16.877" x2="21.086" y2="16.877"/>
        
          <Line {...styles.cls1} {...dynamic} x1="19.362" y1="19.567" x2="21.086" y2="19.567"/>
        
          <Line {...styles.cls1} {...dynamic} x1="19.362" y1="22.257" x2="21.086" y2="22.257"/>
      </G>
      <G>
        
          <Line {...styles.cls1} {...dynamic} x1="15.406" y1="16.877" x2="17.13" y2="16.877"/>
        
          <Line {...styles.cls1} {...dynamic} x1="15.406" y1="19.567" x2="17.13" y2="19.567"/>
        
          <Line {...styles.cls1} {...dynamic} x1="15.406" y1="22.257" x2="17.13" y2="22.257"/>
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
