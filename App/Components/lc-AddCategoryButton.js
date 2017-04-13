/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
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
import Touchable from '../Components/Touchable'

// Internal 
import Design from "../DesignParameters"
import Palette from '../Palette'

class AddCategoryButton extends Component {

  constructor(...params) {
    super(...params)

    this.onBoundPressButton = this.onPressButton.bind(this)
  }

  onPressButton (event) {
    alert('You beauty!')
  }

  render() {

    return (
	  <Card style={style.card}>
	    <CardItem>
	      <View style={style.cardHeader}>
	        <Text style={style.cardHeadingText}>{this.props.headingText.toUpperCase()}</Text>
	        <Touchable onPress={this.onBoundPressButton}>
	          <Text>+</Text>
	        </Touchable>
	      </View>
	    </CardItem>
	  </Card>
	)
  }
}

const style = {
  card: {
    marginTop: Design.paddingLeft / 2,
    marginLeft: Design.paddingLeft / 2,
    marginRight: Design.paddingRight / 2
  },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardHeadingText: {
    "fontSize": 10,
    fontWeight: 'bold'
  },
  cardHeadingIcon: {
    marginTop: -10,
    color: Palette.consentGrayDark
  },
  cardHeadingIconSmall: {
    fontSize: 30
  },
  cardHeadingIconLarge: {
    fontSize: 32
  }
}

AddCategoryButton.defaultProps = {
  headingText: 'NOT_SET'
}

AddCategoryButton.propTypes = {
  headingText: React.PropTypes.string
}

export default AddCategoryButton
