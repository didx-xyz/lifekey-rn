/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

 // Neccessary due to https://github.com/facebook/react-native/issues/3198

// external dependencies
import React, { Component } from 'react'
import { Text, View, Image } from "react-native"
import PropTypes from "prop-types"


class CircularImage extends Component {

  render () {

    const { uri, radius, borderColor } = this.props
    const negativeRadius = radius*-1
    const borderRadius = radius + (radius / 2)

    return (
      <View style={{ "margin": radius / 3 }}>
        <View style={ Object.assign({}, 
                      styles.headerIcon, 
                      {
                        "width": radius*2, 
                        "height": radius*2
                      })}>

          <Image source={{ uri: uri }} style={{ width: "100%", height: "100%" }} />
        </View>
        <View style={ Object.assign({}, 
                      styles.fixCircleClipping, 
                      {
                       "top": negativeRadius,
                       "bottom": negativeRadius,
                       "left": negativeRadius,
                       "right": negativeRadius, 
                       "borderRadius": borderRadius, 
                       "borderWidth": radius,
                       "borderColor": borderColor
                      })}/>
      </View>   
    )
  }
}

const styles = {
  "headerIcon": {
    "justifyContent": "center",
    "alignItems": "center"
  },
  "fixCircleClipping": {
    "position": 'absolute'
  },
}

export default CircularImage
