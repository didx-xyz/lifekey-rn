/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'

import {
  Text
} from 'react-native'

import {
  Container,
  Content,
  List,
  ListItem
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'

export default class DebugViewConnectionRequests extends Scene {

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  _renderUserConnectionRequest(ucr) {
    // TODO - onpress navigate to connection request page with these props: ucr.id, ucr.from_id, ucr.from_did, ucr.from_nickname
    return (
      <ListItem>
        <Text>{ucr.from_nickname}</Text>
      </ListItem>
    )
  }

  render() {

    // get UCRs from session storage
    var ucr_map = Session.getState().connections.user_connection_requests || {}
    // map it to an array of objects
    var user_connection_requests = Object.keys(ucr_map).map(function(ucr_key) {
      return {
        id: ucr_map[ucr_key].id,
        from_id: ucr_map[ucr_key].from_id,
        from_did: ucr_map[ucr_key].from_did,
        from_nickname: ucr_map[ucr_key].from_nickname
      }
    })
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <List dataArray={user_connection_requests}
                renderRow={this._renderUserConnectionRequest.bind(this)} />
        </Content>
      </Container>
    )
  }
}
