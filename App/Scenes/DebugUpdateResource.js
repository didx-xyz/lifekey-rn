
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
import Crypto from '../Crypto'
import Config from '../Config'
// import Logger from '../Logger'

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
    
    var sesh = Session.getState()
    if ('user_data' in sesh && this.props.passProps.resource_key in sesh.user_data) {
      var res = sesh.user_data[this.props.passProps.resource_key]
      this.setState({
        resource: {
          entity: res.entity,
          attribute: res.attribute,
          alias: res.alias,
          value: res.value,
          mime: res.mime,
          encoding: res.encoding,
          is_default: res.is_default,
          is_archived: res.is_archived,
          fetched: true
        }
      })
    } else if (!this.state.resource.fetched) {
      this._refreshResource(false)
    } else {
      // nothing doing
    }
  }

  async _refreshResource(local = true) {
    var resource_get
    if (local) {
      resource_get = Session.state.user_data[this.props.passProps.resource_key]
    } else {
      resource_get = await doAuthenticatedRequest(
        `${Config.http.baseUrl}/resource/${this.props.passProps.resource_key}`
      )

      if (resource_get.error) {
        return alert(resource_get.message)
      }
      resource_get = resource_get.body
    }
    resource_get.fetched = true
    this.setState({resource: resource_get})
  }

  _toggleEditMode() {
    if (!this.state.resource.fetched) return
    if (this.state.editing) {
      this.setState({editing: false})
      this.setState({update: false})
    } else {
      this.setState({editing: true})
      this.setState({update: this.state.resource})
    }
  }

  async _updateResource() {
    if (!(this.state.editing || this.state.update)) {
      // cant send an update if we aren't editing
      return alert('Edit mode is not enabled.')
    } else if (Object.keys(this.state.update).length === 0) {
      // no resource updates have been added
      return alert('No fields have been updated.')
    } else {
      var update = this.state.update
      this.setState({update: false})
      var user_datum_key = `${this.state.resource.entity}/${this.state.resource.attribute}/${this.state.resource.alias}`
      var resource_update = await doAuthenticatedRequest(
        `${Config.http.baseUrl}/resource/${user_datum_key}`,
        'put',
        update
      ).catch(err => {
        alert('An error occurred while attempting to update the specified resource.')
      })

      if (resource_update.error) {
        return alert(resource_update.message)
      }

      var session_update = {user_data: {}}
      var session_update_object = {
        entity: this.state.resource.entity,
        attribute: this.state.resource.attribute,
        alias: this.state.resource.alias,
        value: update.value,
        mime: update.mime,
        encoding: update.encoding,
        is_default: update.is_default,
        is_archived: update.is_archived,
      }
      session_update.user_data[user_datum_key] = session_update_object
      
      Promise.all([
        (_ => Session.state.user_data[user_datum_key] = session_update_object)(),
        Storage.store(Config.storage.dbKey, session_update)
      ]).then(_ => {
        this._toggleEditMode()
        return Promise.resolve()
      }).then(_ => {
        this._refreshResource()
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
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <ListItem itemHeader first>
            <Text>UPDATE {this.props.passProps.resource_key}</Text>
          </ListItem>
          <Button onPress={this._refreshResource.bind(this, false)}>
            <Text>Refresh</Text>
          </Button>
          <Button onPress={this._toggleEditMode.bind(this)}>
            <Text>Toggle Edit Mode</Text>
          </Button>
          {
            this.state.resource.fetched && (
              this.state.editing && (
                <View>
                  <TextInput value={(this.state.update || this.state.resource).encoding}
                             onChangeText={this._updateEncoding.bind(this)} />
                  <TextInput value={(this.state.update || this.state.resource).mime}
                             onChangeText={this._updateMime.bind(this)} />
                  <Text>Default resource for this entity/attribute?</Text>
                  <Switch disabled={false}
                          value={(this.state.update || this.state.resource).is_default}
                          onValueChange={this._updateIsDefault.bind(this)} />
                  <Text>Archived resource?</Text>
                  <Switch disabled={false}
                          value={(this.state.update || this.state.resource).is_archived}
                          onValueChange={this._updateIsArchived.bind(this)} />
                  <TextInput value={(this.state.update || this.state.resource).value}
                             onChangeText={this._updateValue.bind(this)} />
                  <Button onPress={this._updateResource.bind(this)}>
                    <Text>Submit</Text>
                  </Button>
                </View>
              ) || (
                <View>
                  <Text>{this.state.resource.encoding}</Text>
                  <Text>{this.state.resource.mime}</Text>
                  <Text>Default resource for this entity/attribute?</Text>
                  <Switch disabled={true}
                          value={this.state.resource.is_default} />
                  <Text>Archived resource?</Text>
                  <Switch disabled={true}
                          value={this.state.resource.is_archived} />
                  <Text>{this.state.resource.value}</Text>
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
