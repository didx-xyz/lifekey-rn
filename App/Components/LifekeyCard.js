/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import {
  Card,
  CardItem
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import Palette from '../Palette'
import Touchable from '../Components/Touchable'
import PropTypes from "prop-types"

class LifekeyCard extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Card style={style.card}>
        <CardItem>
          <View style={style.heading}>
            <Text style={style.headingText}>{this.props.headingText.toUpperCase()}</Text>
            <Icon style={style.headingIcon} name="angle-down" size={40} color={Palette.consentGrayDark} />
          </View>
          <View style={style.children}>
            {this.props.children}
          </View>
        </CardItem>
        <CardItem>
          <View style={style.footer}>
            <View style={style.footerLeftView}>
              <Touchable onPress={() => this.props.onPressEdit()}>
                <Text style={style.footerLeftText}>EDIT</Text>
              </Touchable>
            </View>
            <View style={style.footerRightView}>
              <Touchable onPress={() => this.props.onPressShare()}>
                <Text style={style.footerRightText}>SHARE</Text>
              </Touchable>
            </View>
          </View>
        </CardItem>
      </Card>
    )
  }
}

const style = {
  card: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headingText: {
    fontWeight: 'bold'
  },
  headingIcon: {
    marginTop: -10
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerLeftView: {
    flex: 1
  },
  footerLeftText: {
    color: Palette.consentGrayDark,
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 10
  },
  footerRightView: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerRightText: {
    color: Palette.consentBlue,
    fontWeight: 'bold',
    fontSize: 16,
    paddingRight: 10
  },
}

LifekeyCard.defaultProps = {
  headingText: 'NOT_SET'
}

LifekeyCard.propTypes = {
  headingText: PropTypes.string
}

export default LifekeyCard
