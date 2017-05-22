// external dependencies
import React, { Component } from "react"
import { View, Text } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import PropTypes from "prop-types"

// internal dependencies
import Design from "../DesignParameters"
import Palette from "../Palette"
import Touchable from "../Components/Touchable"

class ContextDropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      "expanded": false
    }

    this.onBoundPressSwitchExpand = this.onPressSwitchExpand.bind(this)
  }

  onPressSwitchExpand(event) {
    alert("EXPAND")
    // this.setState({
    //   "expanded": !this.state.expanded
    // })
  }

  render() {   
    return(
      <View style={styles.card}>
        <View style={ Object.assign({}, styles.cardBody, {"backgroundColor": this.props.expanded ? "green" : "red"}) }>
          { this.props.children }
        </View>
        { this.props.expanded ? 
          <View style={styles.contextMenu}>
          {
            Object.values(this.props.links).map((l, i) => {
              return (
                <Text key={i}>{l}</Text>
              )
            })
          }
          </View>
          :
          <View></View> 
        }
      </View>
    )
  }
}

const styles = {
  "card": {
    "marginTop": Design.paddingLeft / 2,
    "marginLeft": Design.paddingLeft / 2,
    "marginRight": Design.paddingRight / 2
  },
  "cardBody": {
    "flex": 1,
    "paddingTop": 0,
    "marginTop": -10
  },
  "contextMenu": {
    "position": "absolute",
    "top": 0
  }
}

ContextDropdown.defaultProps = {
  "headingText": "heading not set"
}

ContextDropdown.propTypes = {
  "headingText": PropTypes.string,
  "onPressEdit": PropTypes.func,
  "onPressDelete": PropTypes.func,
  "onPressShare": PropTypes.func
}

export default ContextDropdown
