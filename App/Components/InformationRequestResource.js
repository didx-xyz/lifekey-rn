// external dependencies
import React, { Component } from "react"
import { View, Text } from "react-native"
import { Card } from "native-base"
import PropTypes from "prop-types"

// internal dependencies
import Palette from "../Palette"
import Touchable from "../Components/Touchable"

class InformationRequestResource extends Component {
  constructor(...params) {
    super(...params)

    this.onBoundAction = this.onAction.bind(this)
  }

  onAction(e) {
    e.preventDefault()

    this.props.onAction(this.props.action)
  }

  render() {
    const title = {...styles.title}

    if (!this.props.children || this.props.children.length === 0) {
      title.marginBottom = 0
    }

    return (
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.left}>
            <View style={title}>
              <Text>
                <Text style={styles.titleText}>
                  {this.props.title.toUpperCase()}
                </Text>
                {this.props.meta &&
                  <Text style={styles.metaText}>
                    {" "}
                    {this.props.meta.toUpperCase()}
                  </Text>
                }
              </Text>
            </View>
            {this.props.children &&
              <View style={styles.children}>
                {this.props.children}
              </View>
            }
          </View>
          {this.props.action &&
            <View style={styles.right}>
              <Touchable onPress={this.onBoundAction}>
                {this.props.action == "add" &&
                  <Text>A</Text>
                }
                {this.props.action == "edit" &&
                  <Text>E</Text>
                }
              </Touchable>
            </View>
          }
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
  "title": {
    "flexDirection": "row",
    "justifyContent": "space-between",
    "marginBottom": 10
  },
  "titleText": {
    "fontWeight": "bold",
    "fontSize": 10
  },
  "metaText": {
    "fontWeight": "normal",
    "fontSize": 10,
    "color": "#aaa"
  },
  "row": {
    "flex": 1,
    "flexDirection": "row"
  },
  "left": {
    "flex": 1
  },
  "right": {
    "width": 40,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "children": {
    "flex": 1
  }
}

InformationRequestResource.defaultProps = {
  "title": "heading not set"
}

InformationRequestResource.propTypes = {
  "title": PropTypes.string,
  "meta": PropTypes.string,
  "action": PropTypes.oneOf(["edit", "add"]),
  "onAction": PropTypes.func
}

export default InformationRequestResource
