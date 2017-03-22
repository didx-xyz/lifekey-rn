import React from "react"
import { Dimensions } from "react-native"
import Svg, { Path, Circle, Rect } from "react-native-svg"

class Dots extends React.Component {
  render() {
    const { width } = Dimensions.get("window")

    const props = this.props
    const usedWidth = props.width || width
    const totalWidth = (props.max * (props.radius + props.space + props.strokeWidth)) - props.space
    const startLeft = (width / 2) - (totalWidth / 2)

    let dots = []

    for (let i = 0; i < props.max; i++) {
      const filled = (i < props.current)

      dots.push(
        <Circle
          key={i}
          cx={startLeft + (i * (props.radius + props.space + props.strokeWidth))}
          cy={props.height / 2}
          r={props.radius}
          fill={ filled ? props.fullFill : props.emptyFill }
          strokeWidth={props.strokeWidth}
          stroke={props.strokeColor}
        />
      )
    }

    return (
      <Svg width={usedWidth} height={props.height}>
        {dots}
      </Svg>
    )
  }
}

Dots.defaultProps = {
  "max": 5,
  "height": 30,
  "radius": 5,
  "space": 40,
  "emptyFill": "#f9fafa",
  "fullFill": "#3c8dfc",
  "strokeWidth": 1,
  "strokeColor": "#3c8dfc"
}

Dots.propTypes = {
  "max": React.PropTypes.number,
  "height": React.PropTypes.number,
  "radius": React.PropTypes.number,
  "space": React.PropTypes.number,
  "emptyFill": React.PropTypes.string,
  "fullFill": React.PropTypes.string,
  "strokeWidth": React.PropTypes.number,
  "strokeColor": React.PropTypes.string
}

export default Dots
