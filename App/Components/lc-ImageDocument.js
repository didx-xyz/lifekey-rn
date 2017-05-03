import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text, Image } from 'react-native'

//Internal dependencies 
import Design from "../DesignParameters"
import Palette from "../Palette"
import RcItemDetail from "./ResourceComponents/rc-DetailView"
// import LcSummary from "./LcSummary"


class LcImageDocument extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { expanded, title, documentIdentifier } = this.props
    const documentUri = `data:image/jpg;base64,${this.props[documentIdentifier]}`
    
    if(expanded)
      return (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: documentUri, scale: 1 }}></Image>
        </View>
      )
    else
      return (
        <View>
          <Text>{title}</Text>
        </View>
      )
  }
}

const styles = {
  "unexpandedListCard": {
    "width": "100%",
    "flexDirection": "column"
  },
  "imageContainer":{
    "flex": 1,
    "backgroundColor": Palette.consentGrayDark,
    "width": "100%",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "image": {
    "width": "100%",
    "height": 400,
    "resizeMode": "cover",
  }
}

export default LcImageDocument
