
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
import Api from '../Api'

import {
  View,
  Text,
  TextInput,
  Image,
  Switch
} from 'react-native'

import {
  Container,
  Content,
  List,
  ListItem,
  Button
} from 'native-base'

import AndroidBackButton from 'react-native-android-back-button'

export default class DebugUpdateResource extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      update: false,
      editing: false,
      resource: {
        fetched: false
      }
    }
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }
  
  componentDidMount() {
    super.componentDidMount()
    var resource = Session.state.resources[this.props.passProps.resource_key]
    if (Object.keys(resource).length) {
      this.setState({
        resource: {
          ...resource,
          fetched: true
        }
      })
    } else {
      this._refreshResource()
    }
  }

  async _refreshResource() {
    var resource_get = await Api.doAuthenticatedRequest(
      `${Config.http.baseUrl}/resource/${this.props.passProps.resource_key}`
    )
    if (resource_get.error) return alert(resource_get.message)
    resource_get = resource_get.body
    var resources_update = {resources: {}}
    resources_update[this.props.passProps.resource_key] = resource_get
    return Promise.all([
      this.setState({
        resource: {
          ...resource_get,
          fetched: true
        }
      }),
      (_ => {
        Session.state.resources[this.props.passProps.resource_key] = resource_get
      })(),
      Storage.store(Config.storage.dbKey, resources_update)
    ])
  }

  _toggleEditMode() {
    if (!this.state.resource.fetched) return
    this.setState(
      this.state.editing ?
      {editing: false, update: false} :
      {editing: true, update: this.state.resource}
    )
  }

  async _updateResource() {
    if (!(this.state.editing || this.state.update)) {
      // cant send an update if we aren't editing
      return alert('Edit mode is not enabled.')
    } else {
      var update = this.state.update
      var resource_update = await Api.doAuthenticatedRequest(
        `${Config.http.baseUrl}/resource/${this.props.passProps.resource_key}`,
        'put',
        update
      ).catch(err => {
        alert('Failed to update the resource.')
      })

      if (resource_update.error) {
        return alert(resource_update.message)
      }

      var resources_update = {resources: {}}
      var updated_resource = {
        ...this.state.resource,
        ...update
      }
      resources_update.resources[
        this.props.passProps.resource_key
      ] = updated_resource
      return Promise.all([
        (_ => {
          this.setState({
            update: false,
            resource: {
              ...update,
              fetched: true
            }
          })
        })(),
        (_ => Session.state.resources[
          this.props.passProps.resource_key
        ] = updated_resource)(),
        Storage.store(Config.storage.dbKey, resources_update)
      ]).then(_ => {
        this._toggleEditMode()
      }).catch(
        alert.bind(alert, 'error updating session with new resource')
      )
    }
  }

  _updateEncoding(encoding) {
    this.setState({
      update: {
        ...this.state.update,
        encoding: encoding
      }
    })
  }

  _updateMime(mime) {
    this.setState({
      update: {
        ...this.state.update,
        mime: mime
      }
    })
  }

  _updateIsDefault(is_default) {
    this.setState({
      update: {
        ...this.state.update,
        is_default: is_default
      }
    })
  }

  _updateIsArchived(is_archived) {
    this.setState({
      update: {
        ...this.state.update,
        is_archived: is_archived
      }
    })
  }

  _updateValue(value) {
    this.setState({
      update: {
        ...this.state.update,
        value: value
      }
    })
  }

  render() {
    return (
      <Container>
        <Content style={{padding: 5}}>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <ListItem itemHeader first>
            <Text>UPDATE {this.props.passProps.resource_key}</Text>
          </ListItem>
          <Button onPress={this._refreshResource.bind(this)}>
            <Text>Refresh</Text>
          </Button>
          <Button onPress={this._toggleEditMode.bind(this)}>
            <Text>Toggle Edit Mode</Text>
          </Button>
          {
            this.state.resource.fetched && (
              this.state.editing && (
                <View>
                  <ListItem itemHeader first>
                    <Text>RESOURCE KEY</Text>
                  </ListItem>
                  <ListItem itemHeader first>
                    <Text>{this.state.resource.entity}/{this.state.resource.attribute}/{this.state.resource.alias}</Text>
                  </ListItem>
                  <ListItem itemHeader first>
                    <Text>RESOURCE VALUE</Text>
                  </ListItem>
                  <TextInput placeholder={'Resource value'}
                             value={(this.state.update || this.state.resource).value}
                             onChangeText={this._updateValue.bind(this)} />
                  <ListItem itemHeader first>
                    <Text>RESOURCE METADATA</Text>
                  </ListItem>
                  <TextInput placeholder={'Encoding'}
                             value={(this.state.update || this.state.resource).encoding}
                             onChangeText={this._updateEncoding.bind(this)} />
                  <TextInput placeholder={'Mime type'}
                             value={(this.state.update || this.state.resource).mime}
                             onChangeText={this._updateMime.bind(this)} />
                  <Text>Default resource for this entity/attribute?</Text>
                  <Switch disabled={false}
                          value={(this.state.update || this.state.resource).is_default}
                          onValueChange={this._updateIsDefault.bind(this)} />
                  <Text>Archived resource?</Text>
                  <Switch disabled={false}
                          value={(this.state.update || this.state.resource).is_archived}
                          onValueChange={this._updateIsArchived.bind(this)} />
                  <Button onPress={this._updateResource.bind(this)}>
                    <Text>Submit</Text>
                  </Button>
                </View>
              ) || (
                <View>
                  <ListItem itemHeader first>
                    <Text>RESOURCE KEY</Text>
                  </ListItem>
                  <ListItem itemHeader first>
                    <Text>{this.state.resource.entity}/{this.state.resource.attribute}/{this.state.resource.alias}</Text>
                  </ListItem>
                  <ListItem itemHeader first>
                    <Text>RESOURCE VALUE</Text>
                  </ListItem>
                  <ListItem itemHeader first>
                    <Text>{this.state.resource.value}</Text>
                  </ListItem>
                  <ListItem itemHeader first>
                    <Text>RESOURCE METADATA</Text>
                  </ListItem>
                  <ListItem itemHeader first>
                    <Text>{this.state.resource.encoding}</Text>
                  </ListItem>
                  <ListItem itemHeader first>
                    <Text>{this.state.resource.mime}</Text>
                  </ListItem>
                  <Text>Default resource for this entity/attribute?</Text>
                  <Switch disabled={true}
                          value={this.state.resource.is_default} />
                  <Text>Archived resource?</Text>
                  <Switch disabled={true}
                          value={this.state.resource.is_archived} />
                </View>
              )
            ) || (
              <Text>Fetching resource data, please wait...</Text>
            )
          }
        </Content>
      </Container>
    )
  }
}
