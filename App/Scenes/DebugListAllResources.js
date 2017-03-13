/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Ant Cosentino <ant@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Storage from '../Storage'
import Config from '../Config'
import Crypto from '../Crypto'

import DebugUpdateResource from './DebugUpdateResource'
import DebugCreateResource from './DebugCreateResource'

import {
  Text,
  Switch,
  Image
} from 'react-native'

import {
  Container,
  Content,
  List,
  ListItem,
  Button
} from 'native-base'

import AndroidBackButton from 'react-native-android-back-button'

async function doAuthenticatedRequest(uri, method, body) {
  var toSign = Date.now().toString()
  var caught = false
  try {
    var name = await Crypto.getCurrentKeyStoreAlias()
  } catch (e) {
    caught = true
  }
  try {
    if (caught) name = await Crypto.loadKeyStore('consent', Session.state.userPassword)
    var signature = await Crypto.sign(toSign, 'private_lifekey', Session.state.userPassword, Crypto.SIG_SHA256_WITH_RSA)
    var opts = {
      method: method || 'get',
      headers: {
        "content-type": "application/json",
        'x-cnsnt-id': Session.getState().dbUserId,
        'x-cnsnt-plain': toSign,
        'x-cnsnt-signed': signature.trim()
      }
    }
    if (typeof body === 'object' && body !== null) {
      opts.body = JSON.stringify(body)
    }
    var response = await fetch(uri, opts)
    return (await response.json())
  } catch (e) {
    return {error: true, message: e.toString()}
  }
}

export default class DebugListAllResources extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      current_session: Session.getState()
    }
  }

  componentDidMount() {
    super.componentDidMount()

    // this block builds a shallow index of the user's data stored on the server
    // note that it is pretty inefficient and can be improved with a new endpoint on the server
    // it currently completes in O(N^3) :(
    if (!Object.keys(this.state.current_session.user_data).length) {
      this._refreshResources()
    }
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  async _refreshResources() {
    try {
      var new_user_data = await this._buildShallowResourcesIndex()
    } catch (e) {
      return this.setState({error: e.toString()})
    }
    var session_update = {user_data: new_user_data}
    Promise.all([
      this.setState({error: false, current_session: session_update}),
      Session.update(session_update),
      Storage.store(Config.storage.dbKey, session_update)
    ]).catch(
      alert.bind(alert, 'error storing refreshed resources')
    )
  }

  async _buildShallowResourcesIndex() {
    var user_data = {}
    var entities = await doAuthenticatedRequest(
      `${Config.http.baseUrl}/resource`
    )
    
    if (entities.error) throw new Error(entities.message)

    entities = entities.body
    
    for (var entity in entities) {
      var attributes = await doAuthenticatedRequest(
        `${Config.http.baseUrl}/resource/${entities[entity]}`
      )

      if (attributes.error) throw new Error(attributes.message)

      attributes = attributes.body

      for (var attribute in attributes) {
        var aliases = await doAuthenticatedRequest(
          `${Config.http.baseUrl}/resource/${entities[entity]}/${attributes[attribute]}`
        )

        if (aliases.error) throw new Error(aliases.message)
        
        aliases = aliases.body

        for (var alias in aliases) {
          var user_datum = this.state.current_session.user_data[`${entities[entity]}/${attributes[attribute]}/${aliases[alias]}`]
          user_data[`${entities[entity]}/${attributes[attribute]}/${aliases[alias]}`] = user_datum || {}
        }
      }
    }

    return user_data
  }

  _navigateToCreateResource() {
    this.navigator.push({scene: DebugCreateResource})
  }

  _navigateToUpdateResource(resource_key) {
    this.navigator.push({
      scene: DebugUpdateResource,
      passProps: {resource_key: resource_key}
    })
  }

  _renderResource(resource_key) {
    return (
      <ListItem onPress={this._navigateToUpdateResource.bind(this, resource_key)}>
        <Text>{resource_key}</Text>
      </ListItem>
    )
  }

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={this._hardwareBackHandler.bind(this)} />
          <ListItem itemHeader first>
            <Text>USER RESOURCES</Text>
          </ListItem>
          <Button onPress={this._navigateToCreateResource.bind(this)}>
            <Text>Create</Text>
          </Button>
          <Button onPress={this._refreshResources.bind(this)}>
            <Text>Refresh</Text>
          </Button>
          {
            this.state.error && (
              <Text>{this.state.error}</Text>
            ) || (
              this.state.current_session.user_data && (
                <List dataArray={Object.keys(this.state.current_session.user_data)}
                      renderRow={this._renderResource.bind(this)} />
              ) || (
                <Text>No resources, yet!</Text>
              )
            )
          }
        </Content>
      </Container>
    )
  }
}
