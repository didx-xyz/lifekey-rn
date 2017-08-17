// external dependencies
import React from "react"
import Svg, { Rect, Path, G } from "react-native-svg"
import PropTypes from "prop-types"
import Palette from "../Palette"

const ScanIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
        <Rect x="3.24" y="3.24" width="11.7" height="11.7" rx="1.5" ry="1.5" {...styles.cls1} {...dynamic}/>
        <Rect x="6.14" y="19.95" width="5.92" height="5.92" {...dynamic} {...styles.cls2}/>
        <Rect x="3.24" y="17.06" width="11.7" height="11.7" rx="1.5" ry="1.5" {...styles.cls1} {...dynamic}/>
        <Rect x="17.06" y="3.24" width="11.7" height="11.7" rx="1.5" ry="1.5" {...styles.cls1} {...dynamic}/>
        <Rect x="19.95" y="6.14" width="5.92" height="5.92" {...dynamic} {...styles.cls2}/>
        <Rect x="17.02" y="17.18" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="21.72" y="17.18" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="26.47" y="17.18" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="19.37" y="19.55" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="24.12" y="19.55" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="17.02" y="21.91" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="21.72" y="21.91" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="26.47" y="21.91" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="19.37" y="24.27" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="24.12" y="24.27" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="17.02" y="26.64" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="21.72" y="26.64" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
        <Rect x="26.47" y="26.64" width="2.36" height="2.36" rx="1.07" ry="1.07" {...dynamic} {...styles.cls2}/>
    </Svg>

      

  )
}

ScanIcon.defaultProps = {
  "stroke": "#000"
}

ScanIcon.propTypes = {
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
    "fill": Palette.consentWhite,
    "stroke": "transparent",
    "strokeWidth": 0
  }
  // ,
  // "cls3": {
  //   "fill": "none",
  //   "strokeLinecap": "round",
  //   "strokeLinejoin": "round",
  //   "strokeWidth": 2
  // }
}

export default ScanIcon
