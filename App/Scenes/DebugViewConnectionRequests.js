/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'

import DebugRespondUserConnectionRequest from './DebugRespondUserConnectionRequest'

import {
  Text
} from 'react-native'

import {
  Container,
  Content,
  List,
  ListItem,
  Button
} from 'native-base'

import BackButton from '../Components/BackButton'

export default class DebugViewConnectionRequests extends Scene {
  _navigateRespondUserConnectionRequest(ucr) {
    this.navigator.replace({
      title: 'Respond to Connection Request',
      scene: DebugRespondUserConnectionRequest,
      passProps: {
        id: ucr.id,
        from_id: ucr.from_id,
        nickname: ucr.from_nickname
      }
    })
  }

  _renderUserConnectionRequest(ucr) {
    return (
      <ListItem onPress={this._navigateRespondUserConnectionRequest.bind(this, ucr)}>
        <Text>{ucr.from_nickname}</Text>
      </ListItem>
    )
  }

  render() {

    // get UCRs from session storage
    var ucr_map = Session.getState().connections.user_connection_requests || {}
    // map it to an array of objects
    var user_connection_requests = (
      Object.keys(
        ucr_map
      ).filter(function(ucr_key) {
        return !ucr_map[ucr_key].responded
      }).map(function(ucr_key) {
        return {
          id: ucr_map[ucr_key].id,
          from_id: ucr_map[ucr_key].from_id,
          from_did: ucr_map[ucr_key].from_did,
          from_nickname: ucr_map[ucr_key].from_nickname
        }
      })
    )
    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <ListItem itemHeader first>
            <Text>CONNECTION REQUESTS</Text>
          </ListItem>
          <List dataArray={user_connection_requests}
                renderRow={this._renderUserConnectionRequest.bind(this)} />
        </Content>
      </Container>
    )
  }
}
