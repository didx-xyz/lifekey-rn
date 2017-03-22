import React from "react"
import { Image } from "react-native"

class HexagonDots extends React.Component {
  render() {
    const current = this.props.current

    if (current === 0) {
      return <Image style={{ height: 67, resizeMode: "contain" }} source={require('../Images/blue_dots_1.png')} />
    }

    if (current === 1) {
      return <Image style={{ height: 67, resizeMode: "contain" }} source={require('../Images/blue_dots_2.png')} />
    }

    if (current === 2) {
      return <Image style={{ height: 67, resizeMode: "contain" }} source={require('../Images/blue_dots_3.png')} />
    }

    if (current === 3) {
      return <Image style={{ height: 67, resizeMode: "contain" }} source={require('../Images/blue_dots_4.png')} />
    }

    if (current === 4 || current === 5) {
      return <Image style={{ height: 67, resizeMode: "contain" }} source={require('../Images/blue_dots_5.png')} />
    }

    return null
  }
}

HexagonDots.propTypes = {
  "current": React.PropTypes.number
}

export default HexagonDots
