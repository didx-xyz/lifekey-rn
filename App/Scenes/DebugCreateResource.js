
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
import Api from '../Api'

import {
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

var INITIAL = {
  entity: '',
  attribute: '',
  alias: '',
  encoding: 'utf8',
  mime: 'text/plain',
  is_default: false,
  is_archived: false,
  value: ''
}

export default class DebugCreateResource extends Scene {

  constructor(props) {
    super(props)
    this.state = INITIAL
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  async _createResource() {
    if (!(this.state.entity &&
          this.state.attribute &&
          this.state.alias &&
          this.state.value)) {
      alert('Please choose an entity, attribute, alias and value.')
    }
    var resource_key = `${this.state.entity}/${this.state.attribute}/${this.state.alias}`
    var resource_post = await Api.doAuthenticatedRequest(
      `${Config.http.baseUrl}/resource/${resource_key}`,
      'post',
      this.state
    )

    if (resource_post.error) return alert(resource_post.message)
    var resources_update = {resources: {}}
    resources_update.resources[resource_key] = this.state
    return Promise.all([
      (_ => Session.state.resources[resource_key] = this.state)(),
      Storage.store(Config.storage.dbKey, resources_update)
    ]).then(
      this.navigator.pop
    ).catch(
      alert.bind(alert, 'error updating session with new resource')
    )
  }

  _setEntity(entity) {
    this.setState({entity: entity})
  }

  _setAttribute(attribute) {
    this.setState({attribute: attribute})
  }
  
  _setAlias(alias) {
    this.setState({alias: alias})
  }

  _setEncoding(encoding) {
    this.setState({encoding: encoding})
  }

  _setMime(mime) {
    this.setState({mime: mime})
  }

  _setIsDefault(is_default) {
    this.setState({is_default: is_default})
  }

  _setIsArchived(is_archived) {
    this.setState({is_archived: is_archived})
  }

  _setValue(value) {
    this.setState({value: value})
  }

  _resetForm() {
    this.setState(INITIAL)
  }
  
  _submitForm() {
    this._createResource()
  }

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <ListItem itemHeader first>
            <Text>CREATE A RESOURCE</Text>
          </ListItem>
          <TextInput placeholder={'Entity name'}
                     value={this.state.entity}
                     onChangeText={this._setEntity.bind(this)} />
          <TextInput placeholder={'Attribute name'}
                     value={this.state.attribute}
                     onChangeText={this._setAttribute.bind(this)} />
          <TextInput placeholder={'Alias name'}
                     value={this.state.alias}
                     onChangeText={this._setAlias.bind(this)} />
          <TextInput placeholder={'Resource value'}
                     value={this.state.value}
                     onChangeText={this._setValue.bind(this)} />
          <TextInput placeholder={'Encoding'}
                     value={this.state.encoding}
                     onChangeText={this._setEncoding.bind(this)} />
          <TextInput placeholder={'Mime type'}
                     value={this.state.mime}
                     onChangeText={this._setMime.bind(this)} />
          <Text>Default resource for this entity/attribute?</Text>
          <Switch disabled={false}
                  value={this.state.is_default}
                  onValueChange={this._setIsDefault.bind(this)} />
          <Text>Archived resource?</Text>
          <Switch disabled={false}
                  value={this.state.is_archived}
                  onValueChange={this._setIsArchived.bind(this)} />
          <Button onPress={this._resetForm.bind(this)}>
            <Text>Reset</Text>
          </Button>
          <Button onPress={this._submitForm.bind(this)}>
            <Text>Submit</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}
