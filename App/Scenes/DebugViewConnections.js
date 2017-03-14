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

import BackButton from '../Components/BackButton'

export default class DebugViewConnections extends Scene {
  constructor(props) {
    super(props)
    this.state = {
      current_session: Session.getState()
    }
  }

  _renderUserConnections(uc) {
    return (
      <ListItem>
        <Text>{[
          (this.state.current_session.users[uc.to_id] || {}).nickname,
          (this.state.current_session.users[uc.from_id] || {}).nickname,
        ].filter(n => !!n).pop()}</Text>
      </ListItem>
    )
  }

  render() {
    // get UCs from session storage
    var uc_map = this.state.current_session.connections.user_connections || {}
    // map it to an array of objects
    var user_connections = Object.keys(uc_map).map(function(uc_key) {
      return {
        id: uc_map[uc_key].id,
        from_id: uc_map[uc_key].from_id,
        to_id: uc_map[uc_key].to_id
      }
    })
    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <ListItem itemHeader first>
            <Text>CONNECTIONS</Text>
          </ListItem>
          <List dataArray={user_connections}
                renderRow={this._renderUserConnections.bind(this)} />
        </Content>
      </Container>
    )
  }
}
