/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'

import {
  Text,
  View
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import { Button, H1 } from 'nachos-ui'
import Crypto from '../Crypto'
import AndroidBackButton from 'react-native-android-back-button'
import DialogAndroid from 'react-native-dialogs';

export default class DebugKeyStore extends Scene {


  constructor(props) {
    super(props)
    this.state = {
      stores: [],
      loadedStore: null
    }
  }

  componentDidMount() {
    Crypto.getKeyStoreList()
    .then(result => {
      this.setState({ stores: result })

    })
    .catch(error => {
      alert(error)
    })
  }

  _newKey(text) {
    alert(text)
  }

  _refreshKeystores() {
    Crypto.getKeyStoreList()
    .then( result => {
      this.setState({ stores: result })
    })
    .catch( error => alert(error))
  }

  newKeystore() {
    var name, password
    this._askForInput("Keystore Name", "Enter a name", "Submit", (text) => {
      name = text
      this._askForInput("Keystore Password", "Enter password", "Submit", text => {
        password = text
        this._createKeystore(name, password)
      })
    })
  }

  deleteKeystore() {
    const dialog = new DialogAndroid()
    dialog.set({
      items: this.state.stores,
      title: "Delete keystore",
      "positiveText": "Delete",
      itemsCallbackMultiChoice: (ids, names) => this._deleteKeystore(ids, names)
    })
    dialog.show()
  }

  _deleteKeystore(ids, names) {

    if(ids.length <= 0) {
      // Nothing was selected
      alert("Nothing was selected")
      return
    }
    names.forEach(name => {
      // console.log(`ID ${id} NAME: ${names[id]}`)
      Crypto.deleteKeyStore(name)
      .catch(error => alert(error))
    })
    alert("Deleted: " + JSON.stringify(names))
    this._refreshKeystores()

  }

  _createKeystore(name, password) {
    Crypto.createKeyStore(name, password)
    .then( () => {
      alert(name + " created")
      this._refreshKeystores()
    })
    .catch( error => alert(error))
  }

  _askForInput(title, message, positiveText, onPositive) {
    const dialog = new DialogAndroid()
    dialog.set({
      title: title,
      content: message,
      input: {
        type: 1,
        callback: onPositive
      },
      positiveText: positiveText,
      negativeText: 'Cancel'
    })
    dialog.show()
  }

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <View style={{ alignItems: 'center' }}>
            <H1>Keystore Manager</H1>
          </View>
          <Text>Available Stores: {this.state.stores.map(x => x + ",")}</Text>
          <Text>Loaded Store: {this.state.loadedStore || "None" }</Text>
          <Button style={[styles.btn]} onPress={() => this.newKeystore()}> Create New KeyStore</Button>
          <Button style={[styles.btn]} onPress={() => this.deleteKeystore()}> Delete KeyStore</Button>
        </Content>
      </Container>
    )
  }
}

const styles = {
  btn: {
    margin: 5
  }
}
