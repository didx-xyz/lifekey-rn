/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import React, { Component } from 'react'
import Palette from '../Palette'
import Touchable from '../Components/Touchable'

import {
  Text,
  View,
  StyleSheet
} from 'react-native'

class LifekeyHeader extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bottomLeftText: props.bottomLeftText,
      bottomRightText: props.bottomRightText
    }
  }

  render() {
    return (
      <View style={style.header}>

        { /* TOP SECTION */ }
        <View style={style.topView}>

          { /* TOP LEFT */ }
          <View style={style.topViewLeft}>
            <Text>1</Text>
          </View>

          { /* TOP CENTER */ }
          <View style={style.topViewCenter}>
            <Text>2</Text>
          </View>

          { /* TOP RIGHT */ }
          <View style={style.topViewRight}>
            <Text>3</Text>
          </View>

        </View>

        { /* BOTTOM SECTION */ }
        <View style={style.bottomView}>
          <View style={style.bottomGap}/>

          {/* LEFT BOTTOM TEXT BUTTON */}
          <Touchable onPress={this.props.onPressBottomLeft}>
            <View style={style.bottomButton}>
              <Text style={{ fontSize: 16 }}>CONNECTED</Text>
            </View>
          </Touchable>

          <View style={style.bottomGap}/>

          {/* RIGHT BOTTOM TEXT BUTTON */}
          <Touchable onPress={this.props.onPressBottomRight}>
            <View style={style.bottomButton}>
              <Text style={{ fontSize: 16 }}>SUGGESTED</Text>
            </View>
          </Touchable>

          <View style={style.bottomGap}/>
        </View>

      </View>
    )
  }
}

const style = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    flex: 1
  },
  topView: {
    flex: 3,
    flexDirection: 'row'
  },
  topViewLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topViewCenter: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topViewRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomView: {
    flex: 2,
    flexDirection: 'row',
  },
  bottomGap: {
    flex: 2,
    borderColor: Palette.consentGrayDark,
    borderBottomWidth: 1
  },
  bottomButton: {
    flex: 4,
    borderColor: Palette.consentBlue,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

LifekeyHeader.propTypes = {
  bottomLeftText: React.PropTypes.string,
  onPressBottomLeft: React.PropTypes.func,
  bottomRightText: React.PropTypes.string,
  onPressBottomRight: React.PropTypes.func,
}

LifekeyHeader.defaultProps = {
  onPressBottomLeft: () => alert('Nothing'),
  onPressBottomRight: () => alert('Nothing'),
  bottomLeftText: 'NOT_SET',
  bottomRightText: 'NOT_SET'
}

export default LifekeyHeader
