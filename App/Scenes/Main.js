/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Config from '../Config'

import {
  Text,
  View
} from 'react-native'
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Footer,
  FooterTab,
  Content
} from 'native-base'

const t = require('tcomb-form-native')
const Form = t.form.Form


export default class Main extends Scene {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const pdrData = Session.getState().pdrData

    this.setState({
      pdrData: Session.getState().pdrData
    })
  }

  renderSection(data) {

    return data.map((x, i) =>
      <View key={i}>
        <Text key={i}>{x.section}</Text>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <Header>
          <Button transparent>
            <Icon name="ios-arrow-back"/>
          </Button>
          <Title>Lifekey</Title>
          <Button transparent>
            <Icon name="ios-menu"/>
          </Button>
        </Header>

        <Content>
          {this.renderSection(this.state.pdrData)}
        </Content>

        <Footer>
          <View style={{ alignItems: 'center' }}>
            <Text>{Config.version}</Text>
          </View>
        </Footer>

      </Container>
    )
  }
}
