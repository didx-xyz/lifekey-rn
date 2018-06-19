

/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

import React, { Component } from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Palette from '../Palette'
import Routes from '../Routes'
import Config from '../Config'
import LifekeyHeader from '../Components/LifekeyHeader'
import Touchable from '../Components/Touchable'
import BackButton from "../Components/BackButton"
import PropTypes from "prop-types"

import { Text, View } from 'react-native'
import { Container, Content } from 'native-base'

// internal dependencies
import Design from "../DesignParameters"

class MvTemplate extends Component {

  render () {

    const { tabName } = this.props

    return (
      <Container style={styles.container}>
        <View style={ styles.headerContainer }>
          <BackButton navigator={this.navigator} />
          { this.props.header ? this.props.header() : null }
        </View>

        {this.props.children}

      </Container>
    )
  }
}

MvTemplate.propTypes = {
  "tabName": PropTypes.string
}

const styles = {
  "container": {
    "height" : "100%"
  },
  "headerContainer": {
    "height": `${Design.navigationContainerHeight}%`,
    "borderColor": Palette.consentGrayLightest,
    "borderBottomWidth": 1
  }
}

export default MvTemplate
