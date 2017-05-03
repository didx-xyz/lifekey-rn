import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text, Image } from 'react-native'

//Internal dependencies 
import Design from "../../DesignParameters"
import Palette from "../../Palette"

class RcItemDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      "objKey": props.objKey,
      "value": props.value
    }
  }

  renderValue(key, value, type) {

    if(!value)
      return(
        <Text style={styles.valueUndefined}>Value not provided</Text>
      )

    if (type === "string") {
      return (
        <Text>{value}</Text>
      )
    }
    if (type === "image") {
      return (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: value, scale: 1 }}></Image>
        </View>
      )
    }

    return (
      <Text>unknown type</Text>
    )
  }

  render() {

    const { type, objKey, value } = this.props
    
    return (
      <View style={styles.container}>
        <View><Text style={styles.key}>{objKey.toUpperCase()} : </Text></View>
        <View style={styles.formField}>{ this.renderValue(objKey, value, type) }</View>
      </View>
    )
  }
}

const styles = {
  "container": {
    "flexDirection": "row",
    "backgroundColor": Palette.consentGrayLIght
  },
  "key": {
    "flex": 2,
    "color": Palette.consentBlue
  },
  "formField": {
    "flex": 3,
    "paddingLeft": "5%"
  },
  "value":{
    "color": Palette.consentGrayDark
  },
  "valueUndefined": {
    "color": Palette.consentGrayMedium
  },
  "imageContainer":{
    "backgroundColor": Palette.consentGrayDark,
    "width": "100%",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "image": {
    "width": "100%",
    "height": "100%",
    "resizeMode": "cover",
  }
}

RcItemDetail.defaultProps = {
  "type": "string"
}

RcItemDetail.propTypes = {
  objKey: PropTypes.string
}

export default RcItemDetail
