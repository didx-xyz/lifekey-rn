/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Palette from '../Palette'
import Routes from '../Routes'
import Config from '../Config'
import LifekeyHeader from '../Components/LifekeyHeader'
import LifekeyCard from '../Components/LifekeyCard'
import Touchable from '../Components/Touchable'
import AndroidBackButton from 'react-native-android-back-button'

import { Text, View } from 'react-native'
import { Container, Content } from 'native-base'

export default class Me extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 1 // My data
    }
  }

  _hardwareBack() {
    this.navigator.pop()
    return true
  }

  render() {
    return (
      <Container>
        <View style={{ borderColor: Palette.consentGrayDark, borderBottomWidth: 3, height: 120 }}>
          <AndroidBackButton onPress={() => this._hardwareBack()} />
          <LifekeyHeader
            onLongPressTopCenter={() => this.navigator.push(Routes.debug)}
            icons={[
              <Text>Test1</Text>,
              <Text>Test2</Text>,
              <Text>Test3</Text>
            ]}
            tabs={[
              { text: 'Connect', onPress: () => ({}), active: this.state.activeTab === 0 },
              { text: 'My Data', onPress: () => ({}), active: this.state.activeTab === 1 },
              { text: 'Badges', onPress: () => ({}), active: this.state.activeTab === 2 }
            ]}
          />
        </View>
        <Content style={{ backgroundColor: Palette.consentGrayMedium }}>

          <LifekeyCard
            headingText="Legal Identity"
            onPressEdit={() => alert('EDIT')}
            onPressShare={() => alert('SHARE')}
          >
            <View>
              <Text>Hi</Text>
              <Text>Hi</Text>
              <Text>Hi</Text>
              <Text>Hi</Text>
              <Text>Hi</Text>
            </View>
          </LifekeyCard>

          <LifekeyCard
            headingText="Home Address 1"
            onPressEdit={() => alert('EDIT')}
            onPressShare={() => alert('SHARE')}
          >
            <View>
              <Text>Hi</Text>
              <Text>Hi</Text>
              <Text>Hi</Text>
              <Text>Hi</Text>
              <Text>Hi</Text>
            </View>
          </LifekeyCard>

        </Content>
      </Container>
    )
  }
}
