/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Crypto from '../Crypto'
import Config from '../Config'
import Logger from '../Logger'

import {
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native'

import {
  Container,
  Content,
  Button,
  ListItem
} from 'native-base'

import BackButton from '../Components/BackButton'

export default class DebugBeforeSendConnectionRequest extends Scene {
  constructor(props) {
      super(props)
      this.state = {
          target_user: null
      }
  }

  componentDidMount() {
      super.componentDidMount()
      this.pullProfile(this.props.passProps.url)
  }

  requestConnection() {
      if (!this.state.target_user) return
    const toSign = Date.now().toString()
    Crypto.loadKeyStore(
      'consent', Session.getState().userPassword
    ).then(name => {
      return Crypto.sign(
        toSign,
        "private_lifekey",
        Session.getState().userPassword,
        Crypto.SIG_SHA256_WITH_RSA
      )
    }).then(signature => {
      return fetch(Config.http.baseUrl + "/management/connection", {
        body: JSON.stringify({ target: this.state.target_user.id }),
        method: "POST",
        headers: {
          "content-type": "application/json",
          'x-cnsnt-id': Session.getState().dbUserId,
          'x-cnsnt-plain': toSign,
          'x-cnsnt-signed': signature.trim()
        }
      })
    }).then(response => {
      return response.json()
    }).then(json => {
      if (json.error) {
        return alert(json.message)
      } else {
        alert('Connection request sent')
        this.navigator.pop()
      }
    }).catch(err => {
      alert(err)
    })
  }

  pullProfile(url) {
    var toSign = ''+Date.now()
    Crypto.loadKeyStore(
      'consent', Session.getState().userPassword
    ).then(name => {
      return Crypto.sign(
        toSign,
        "private_lifekey",
        Session.getState().userPassword,
        Crypto.SIG_SHA256_WITH_RSA
      )
    }).then(signature => {
      return fetch(`http://${url}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          'x-cnsnt-id': Session.getState().dbUserId,
          'x-cnsnt-plain': toSign,
          'x-cnsnt-signed': signature.trim()
        }
      })
    }).then(response => {
      return response.json()
    }).then(json => {
      if (json.error) return alert(json.message)

      this.setState({target_user: json.body.user})

      var users_merge = {}
      var new_discovered_user = {
        id: json.body.user.id,
        did: json.body.user.did,
        nickname: json.body.user.nickname
      }
      users_merge[json.body.user.id] = new_discovered_user
      Session.update({ users: users_merge })
      return Storage.store(Config.storage.dbKey, { users: users_merge })
    }).catch(error => {
      Logger.error('Could not update users_merge', this._fileName, error)
    })

  }

  render() {
      var nickname = (this.state.target_user || {}).nickname
    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <ListItem itemHeader first>
            <Text>CONNECTION REQUEST TO USER</Text>
          </ListItem>
          <Text>You are about to send a connection request to {nickname || 'fetching...'}</Text>
          <Button onPress={this.navigator.pop}>
              <Text>Back</Text>
          </Button>
          <Button onPress={this.requestConnection.bind(this)}>
              <Text>Continue</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  btn: {
    margin: 5
  }
})
