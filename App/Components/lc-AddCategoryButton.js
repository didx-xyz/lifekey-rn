// external dependencies
import React, { Component } from "react"
import { View, Text } from "react-native"
import { Card, CardItem } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome"
import PropTypes from "prop-types"

// internal dependencies
import Touchable from "../Components/Touchable"
import Design from "../DesignParameters"
import Palette from "../Palette"

class AddCategoryButton extends Component {
  constructor(...params) {
    super(...params)

    this.onBoundPressEdit = this.onPressEdit.bind(this)
  }

  onPressEdit() {
    this.props.onEditResource(this.props.form)
  }

  render() {
    return (
  	  <Card style={style.card}>
    	    <CardItem onPress={this.onBoundPressEdit}>
      	      <View style={style.cardHeader}>
      	        <Text style={style.cardHeadingText}>{this.props.name.toUpperCase()}</Text>
    	          <Text>+</Text>
      	      </View>
    	    </CardItem>
  	  </Card>
  	)
  }
}

const style = {
  "card": {
    "marginTop": Design.paddingLeft / 2,
    "marginLeft": Design.paddingLeft / 2,
    "marginRight": Design.paddingRight / 2
  },
  "cardHeader": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "space-between"
  },
  "cardHeadingText": {
    "fontSize": 10,
    "fontWeight": "bold"
  },
  "cardHeadingIcon": {
    "marginTop": -10,
    "color": Palette.consentGrayDark
  },
  "cardHeadingIconSmall": {
    "fontSize": 30
  },
  "cardHeadingIconLarge": {
    "fontSize": 32
  }
}

AddCategoryButton.defaultProps = {
  "name": "name not set"
}

AddCategoryButton.propTypes = {
  "name": PropTypes.string,
  "form": PropTypes.string.isRequired
}

export default AddCategoryButton
