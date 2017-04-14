// ME TEMPLATE - HEIN

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
import MvTemplate from '../Components/mv-Template'
import LifekeyHeader from '../Components/LifekeyHeader'
import LifekeyCard from '../Components/LifekeyCard'
import LcLegalIdentity from '../Components/lc-LegalIdentity'
import LcHomeAddress from '../Components/lc-HomeAddress'
import LcContactDetails from '../Components/lc-ContactDetails'
import LcAddCategoryButton from '../Components/lc-AddCategoryButton'
import Touchable from '../Components/Touchable'
import AndroidBackButton from 'react-native-android-back-button'
import BackIcon from '../Components/BackIcon'

import { Text, View } from 'react-native'
import { Container, Content } from 'native-base'

// QR code
import HelpIcon from "../Components/HelpIcon"

// internal dependencies
import Design from "../DesignParameters"

var person = {
  "fullName": "Jacques Noel Kleynhans",
  "idOrigin": "South African ID",
  "idNumber": "8205945067082",
  "address": "52 Stanley Road, Tamboerskloof, Cape Town, South Africa, 8001",
  "contactDetails": [
    {
      listCardHeading: "Mobile",
      listCardPrimaryDetail: "+27 (082) 564 8245",
      listCardSecondaryDetails: ["+27 (072) 223 3254"],
      listImageUrl: "hello"
    },
    {
      listCardHeading: "Home",
      listCardPrimaryDetail: "+27 (021) 425 7685",
      listCardSecondaryDetails: ["021 424 5678"],
      listImageUrl: "hello"
    },
    {
      listCardHeading: "Email",
      listCardPrimaryDetail: "jacques@io.co.za",
      listCardSecondaryDetails: ["jacqieboy@bedbathandbeyond.com", "jacqueslehomme@findyourdesire.fr"],
      listImageUrl: "hello"
    }
  ]
}

var categoriesToAdd = [
  "Life Insurance",
  "Medical Aid",
  "Current Occupation"
]

export default class Me extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      tabName:  "My Data"
    }
  }

  _hardwareBack() {
    this.navigator.pop()
    return true
  }

  render() {
    return (

      <MvTemplate
        tabName={this.state.tabName}
        header={
          () => <LifekeyHeader
            icons={[
              {
                icon: <BackIcon width={15} height={15}/>,
                onPress: () => this.navigator.pop()
              },
              {
                icon: <Text>:)</Text>,
                onPress: () => alert('test')
              },
              {
                icon: <Text>+</Text>,
                onPress: () => alert('test')
              }
            ]}
            tabs={[
              {
                text: 'Connect',
                onPress: () => this.setTab(0),
                active: this.state.activeTab === 0
              },
              {
                text: 'My Data',
                onPress: () => this.setTab(1),
                active: this.state.activeTab === 1
              },
              {
                text: 'Badges',
                onPress: () => this.setTab(2),
                active: this.state.activeTab === 1
              }
            ]}
          />
        }
      >
        <AndroidBackButton onPress={() => this._hardwareBack()} />
        <Content>
          { /* This probably also needs to be generated more dynamically but a little unsure of the schema to implement that currently - hein */ }
          <LifekeyCard headingText="Legal Identity" onPressEdit={() => alert('EDIT')} onPressShare={() => alert('SHARE')} >
            <LcLegalIdentity {...person} />
          </LifekeyCard>

          <LifekeyCard headingText="Home Address 1" onPressEdit={() => alert('EDIT')} onPressShare={() => alert('SHARE')} >
            <LcHomeAddress {...person}/>
          </LifekeyCard>

          <LifekeyCard headingText="Contact Details" onPressEdit={() => alert('EDIT')} onPressShare={() => alert('SHARE')} >
            <LcContactDetails contactDetails={person.contactDetails} />
          </LifekeyCard>

          <View>
            {
              categoriesToAdd
               .map((cat, i) => <LcAddCategoryButton key={i} headingText={cat} />)
            }
          </View>

        </Content>

      </MvTemplate>
    )
  }
}

