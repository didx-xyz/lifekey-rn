/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'

export default class CameraCrosshair extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={style.boxCrosshair}>
        <View style={[style.crosshair, { width: 250, height: 250 }]}>
          <View style={{ flex: 1, flexDirection: 'row' }}>

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
              <View style={[
                style.crosshairTopLeft,
                { width: 50, height: 50, borderColor: this.props.color }
              ]}/>
              <View style={[
                style.crosshairBottomLeft,
                { width: 50, height: 50, borderColor: this.props.color }
              ]}/>
            </View>

            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <View style={[
                style.crosshairTopRight,
                { width: 50, height: 50, borderColor: this.props.color }
              ]}/>
              <View style={[
                style.crosshairBottomRight,
                { width: 50, height: 50, borderColor: this.props.color }
              ]}/>
            </View>

          </View>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  boxCrosshair: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  crosshairTopRight: {
    borderTopWidth: 0.7,
    borderRightWidth: 0.7
  },
  crosshairTopLeft: {
    borderTopWidth: 0.7,
    borderLeftWidth: 0.7
  },
  crosshairBottomRight: {
    borderBottomWidth: 0.7,
    borderRightWidth: 0.7
  },
  crosshairBottomLeft: {
    borderBottomWidth: 0.7,
    borderLeftWidth: 0.7
  }
})
