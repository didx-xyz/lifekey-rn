

/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Palette from '../Palette'
import Routes from '../Routes'
import Config from '../Config'
import LifekeyHeader from '../Components/LifekeyHeader'
import Touchable from '../Components/Touchable'
import BackButton from "../Components/BackButton"

const { string } = React.PropTypes
import { Text, View } from 'react-native'
import { Container, Content } from 'native-base'

// internal dependencies
import Design from "../DesignParameters"

const MvTemplate = React.createClass({
  
  propTypes : {
    tabName: string
  },
  render () {

    const styles = {
      "container": {
        "height" : "100%"
      },
      "headerContainer": {
        height: `${Design.navigationContainerHeight}%`,
        borderColor: Palette.consentGrayLightest, 
        borderBottomWidth: 1
      }
    }

    const { tabName } = this.props

    return (
      <Container style={styles.container}>
        <View style={ styles.headerContainer }>
          <BackButton navigator={this.navigator} />
          <LifekeyHeader
            onLongPressTopCenter={() => this.navigator.push(Routes.debug)}
            icons={[
              <Text>Test1</Text>,
              <Text>Test2</Text>,
              <Text>Test3</Text>
            ]}
            tabs={[
              { text: 'Connect', onPress: () => ({}), active: tabName === 'Connect' },
              { text: tabName, onPress: () => ({}), active: tabName === 'My Data' },
              { text: 'Badges', onPress: () => ({}), active: tabName === 'Badges' }
            ]}
          />
        </View>

        {this.props.children} 

      </Container>
    )
  }
})

export default MvTemplate



