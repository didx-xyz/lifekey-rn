// external dependencies
import React from "react"
import Svg, { Line, Path } from "react-native-svg"
import PropTypes from "prop-types"

const MobileIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      
        <Path {...styles.cls1} {...dynamic} d="M22.093,22.087
          c0,0.447-0.366,0.812-0.812,0.812l-10.561,0c-0.447,0-0.812-0.366-0.812-0.812l0-12.887c0-0.447,0.366-0.812,0.812-0.812l10.561,0
          c0.447,0,0.812,0.366,0.812,0.812L22.093,22.087z"/>
        
          <Path {...styles.cls1} {...dynamic} d="M10.173,4l11.655,0c0.932,0,1.69,0.758,1.69,1.69l0,20.621c0,0.448-0.177,0.872-0.497,1.192
            C22.699,27.823,22.276,28,21.827,28l-11.655,0c-0.932,0-1.69-0.758-1.69-1.69l0-20.621c0-0.448,0.177-0.872,0.497-1.192
            C9.301,4.177,9.724,4,10.173,4 M10.173,3c-1.479,0-2.69,1.21-2.69,2.69l0,20.621c0,1.479,1.21,2.69,2.69,2.69l11.655,0
            c1.479,0,2.69-1.21,2.69-2.69l0-20.621c0-1.479-1.21-2.69-2.69-2.69L10.173,3L10.173,3z"/>
        
        
          <Line {...styles.cls1} {...dynamic} x1="13.563" y1="6.018" x2="18.437" y2="6.018"/>
        
          <Line {...styles.cls1} {...dynamic} x1="15.411" y1="25.95" x2="16.59" y2="25.95"/>
        
          <Line {...styles.cls1} {...dynamic} x1="18.182" y1="25.95" x2="19.361" y2="25.95"/>
        
          <Line {...styles.cls1} {...dynamic} x1="12.639" y1="25.95" x2="13.818" y2="25.95"/>
      
    </Svg>
  )
}

MobileIcon.defaultProps = {
  "stroke": "#000"
}

MobileIcon.propTypes = {
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

export default MobileIcon



// // external dependencies
// import React from "react"
// import Svg, { Line, Path } from "react-native-svg"
// import PropTypes from "prop-types"

// const MobileIcon = (props) => {
//   const dynamic = {
//     "stroke": props.stroke
//   }

//   return (
//     <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.2 26.2">
//       <Path {...styles.cls1} {...dynamic} d="M22.4,22.7c0,0.5-0.4,0.9-0.9,0.9l-11.2,0
//         c-0.5,0-0.9-0.4-0.9-0.9l0-13.6c0-0.5,0.4-0.9,0.9-0.9l11.2,0c0.5,0,0.9,0.4,0.9,0.9L22.4,22.7z"/>
//       <Path {...styles.cls1} {...dynamic} d="M24.2,25.9c0,1.4-1.2,2.6-2.6,2.6l-11.2,0
//         c-1.4,0-2.6-1.2-2.6-2.6l0-19.8c0-1.4,1.2-2.6,2.6-2.6l11.2,0c1.4,0,2.6,1.2,2.6,2.6L24.2,25.9z"/>
//       <Line {...styles.cls1} {...dynamic} x1="13.4" y1="6.1" x2="18.6" y2="6.1"/>
//       <Line {...styles.cls1} {...dynamic} x1="15.4" y1="26.1" x2="16.6" y2="26.1"/>
//       <Line {...styles.cls1} {...dynamic} x1="18.3" y1="26.1" x2="19.5" y2="26.1"/>
//       <Line {...styles.cls1} {...dynamic} x1="12.4" y1="26.1" x2="13.7" y2="26.1"/>
//     </Svg>
//   )
// }

// MobileIcon.defaultProps = {
//   "stroke": "#000"
// }

// MobileIcon.propTypes = {
//   "width": PropTypes.number.isRequired,
//   "height": PropTypes.number.isRequired,
//   "stroke": PropTypes.string
// }

// const styles = {
//   "cls1": {
//     "fill": "none",
//     "strokeMiterlimit": 10
//   },
//   "cls2": {
//     "fill": "none",
//     "strokeLinecap": "round",
//     "strokeLinejoin": "round"
//   },
//   "cls3": {
//     "fill": "none",
//     "strokeLinecap": "round",
//     "strokeLinejoin": "round",
//     "strokeWidth": 2
//   }
// }

// export default MobileIcon
