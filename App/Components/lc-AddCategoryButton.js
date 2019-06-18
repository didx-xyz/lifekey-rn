// external dependencies
import React, { Component } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Card, CardItem } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome"
import PropTypes from "prop-types"

import PlusIcon from "./PlusIcon"

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
    const id = this.props.id || null;
    this.props.onEditResource(this.props.form, id, this.props.name)
  }

  render() {
    return (
  	  <TouchableOpacity onPress={this.onBoundPressEdit} style={style.card}>
    	    <View button>
    	      <View style={style.cardHeader}>
    	        <Text style={Object.assign({}, style.cardHeadingText, { "color": this.props.color }) }>{this.props.name.toUpperCase()}</Text>
                {/* <PlusIcon width={this.props.width} height={this.props.width} stroke={this.props.color}></PlusIcon> */}
    	      </View>
    	    </View>
  	  </TouchableOpacity>
  	)
  }
}

const style = {
  "card": {
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomColor: Palette.consentGrayMedium,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    // "marginLeft": Design.paddingLeft / 2,
    // "marginRight": Design.paddingRight / 2
  },
  "cardHeader": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center"
  },
  "cardHeadingText": {
    "fontSize": 13,
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
  "form": PropTypes.string.isRequired,
  "id": PropTypes.number,
}

export default AddCategoryButton
