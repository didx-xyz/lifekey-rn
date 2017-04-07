// external dependencies
import React, { Component } from "react"
import { View, Text } from "react-native"
import { Card } from "native-base"

// internal dependencies
import Palette from "../Palette"
import Touchable from "../Components/Touchable"

class InformationRequestResource extends Component {
  constructor(...params) {
    super(...params)
  }

  render() {
    return (
      <Card style={styles.card}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>
            {this.props.title.toUpperCase()}
          </Text>
        </View>
        <View>
          {this.props.children}
        </View>
      </Card>
    )
  }
}

const styles = {
  "card": {
    "marginTop": 10,
    "marginLeft": 10,
    "marginRight": 10,
    "marginBottom": 0,
    "padding": 15
  },
  "heading": {
    "flexDirection": "row",
    "justifyContent": "space-between",
    "marginBottom": 10
  },
  "headingText": {
    "fontWeight": "bold",
    "fontSize": 10
  }
}

InformationRequestResource.defaultProps = {
  "headingText": "NOT_SET"
}

InformationRequestResource.propTypes = {
  "headingText": React.PropTypes.string
}

export default InformationRequestResource
