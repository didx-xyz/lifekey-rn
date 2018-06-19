// external dependencies
import React from "react"
import Svg, { Line, Rect, Path } from "react-native-svg"
import PropTypes from "prop-types"

const MobileIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      

      <Rect x="9.91" y="8.39" width="12.19" height="14.51" rx="0.81" ry="0.81" {...styles.cls1} {...dynamic} />
      <Rect x="7.48" y="3" width="17.03" height="26" rx="2.69" ry="2.69"  {...styles.cls1} {...dynamic} />
    
      <Line {...styles.cls1} {...dynamic} x1="13.563" y1="6.018" x2="18.437" y2="6.018"/>
    
      <Line {...styles.cls1} {...dynamic} x1="15.411" y1="25.95" x2="16.59" y2="25.95"/>
    
      <Line {...styles.cls1} {...dynamic} x1="18.182" y1="25.95" x2="19.361" y2="25.95"/>
    
      <Line {...styles.cls1} {...dynamic} x1="12.639" y1="25.95" x2="13.818" y2="25.95"/>
      
    </Svg>
  )

  // <svg xmlns=“http://www.w3.org/2000/svg” width=“32" height=“32” viewBox=“0 0 32 32">
  //  <title>Untitled-1</title>
  //  <rect x=“9.91” y=“8.39" width=“12.19” height=“14.51" rx=“0.81” ry=“0.81" style=“fill: none;stroke: #3e474e ;stroke-linecap: round;stroke-miterlimit: 10”/>
  //  <rect x=“7.48" y=“3” width=“17.03" height=“26” rx=“2.69" ry=“2.69” style=“fill: none;stroke: #3e474e ;stroke-linecap: round;stroke-miterlimit: 10"/>
  //  <line x1=“13.56” y1=“6.02" x2=“18.44” y2=“6.02" style=“fill: none;stroke: #3e474e ;stroke-linecap: round;stroke-miterlimit: 10”/>
  //  <line x1=“15.41" y1=“25.95” x2=“16.59" y2=“25.95” style=“fill: none;stroke: #3e474e ;stroke-linecap: round;stroke-miterlimit: 10"/>
  //  <line x1=“18.18” y1=“25.95" x2=“19.36” y2=“25.95" style=“fill: none;stroke: #3e474e ;stroke-linecap: round;stroke-miterlimit: 10”/>
  //  <line x1=“12.64" y1=“25.95” x2=“13.82" y2=“25.95” style=“fill: none;stroke: #3e474e ;stroke-linecap: round;stroke-miterlimit: 10"/>
  // </svg>

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
    "strokeWidth": 1,
    "strokeMiterlimit": 10
  }
  // ,
  // "cls2": {
  //   "fill": "none",
  //   "strokeLinecap": "round",
  //   "strokeLinejoin": "round"
  // }
  // ,
  // "cls3": {
  //   "fill": "none",
  //   "strokeLinecap": "round",
  //   "strokeLinejoin": "round",
  //   "strokeWidth": 1
  // }
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
