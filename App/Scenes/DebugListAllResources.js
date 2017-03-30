/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Ant Cosentino <ant@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Config from '../Config'
import Api from '../Api'

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

export default class DebugListAllResources extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      current_session: Session.getState()
    }
  }

  componentDidMount() {
    super.componentDidMount()
    this._refreshResources()
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  async _refreshResources() {
    try {
      var resources_index = await this._getResourcesIndex()
    } catch (e) {
      return this.setState({error: e.toString()})
    }
    var resources_update = {resources: resources_index}
    return Promise.all([
      this.setState({error: false, current_session: resources_update}),
      Session.update(resources_update),
      Storage.store(Config.storage.dbKey, resources_update)
    ]).catch(
      alert.bind(alert, 'error storing refreshed resources')
    )
  }

  async _getResourcesIndex() {
    var resources = {}
    var index = await Api.doAuthenticatedRequest(
      `${Config.http.baseUrl}/resource?index=1`
    )
    if (index.error) throw new Error(index.message)
    index.body.map(entry => {
      return [entry.entity, entry.attribute, entry.alias].join('/')
    }).forEach(resource_key => {
      resources[resource_key] = Session.state.resources[resource_key] || {}
    })
    return resources
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
    var resources = Object.keys(this.state.current_session.resources)
    return (
      <Container>
        <Content style={{padding: 5}}>
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
              resources.length && (
                <List renderRow={this._renderResource.bind(this)}
                      dataArray={resources} />
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
