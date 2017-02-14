/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'

import {
  Text
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import { Button } from 'nachos-ui'
import Crypto from '../Crypto'
export default class KeypairGenerator extends Scene {


  constructor(props) {
    super(props)
    this.state = {
      stores: []
    }
  }

  componentDidMount() {
    Crypto.getKeyStoreList()
    .then(result => {
      alert(result)
      this.setState({ stores: result })
    })
    .catch(error => {
      alert(error)
    })
    this.forceUpdate()
  }

  _create() {

  }

  render() {
    return (
      <Container>
        <Content>
          <Button onPress={() => this._create()}> Create New KeyStore</Button>
            <Text>Stores: {this.state.stores.map(x => x + ",")}</Text>
        </Content>
      </Container>
    )
  }
}
