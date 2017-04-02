/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'

import {
  Text,
  View
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import { Button, H1, H2 } from 'nachos-ui'
import Crypto from '../../Crypto'
import BackButton from '../../Components/BackButton'
import DialogAndroid from 'react-native-dialogs'

export default class DebugKeyStore extends Scene {


  constructor(props) {
    super(props)
    this.state = {
      stores: [],
      loadedStore: null,
      loadedStoreKeys: []
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

  newKey(text) {
    if (!this.state.loadedStore) {
      alert("A keystore must first be loaded")
      return
    }
    const dialog = new DialogAndroid()
    dialog.set({
      title: "Create key",
      content: "Please enter an alias for the keypair",
      input: {
        type: 1,
        callback: (alias) => {
          const passDialog = new DialogAndroid()
          passDialog.set({
            title: "Set password",
            content: "Please enter a password for the key",
            input: {
              type: 1,
              callback: (password) => {
                Crypto.addKeyPair(
                  Crypto.KEYPAIR_RSA,
                  alias,
                  2048,
                  password,
                  "rsa-example.pem"
                )
                .then(() => {
                  alert("Key created")
                  this._refreshKeys()
                })
                .catch(error => alert(error))
              }
            }
          })
          passDialog.show()
        }
      }
    })
    dialog.show()
  }

  _refreshKeystores() {
    Crypto.getKeyStoreList()
    .then( result => {
      this.setState({ stores: result })
    })
    .catch( error => alert(error))
  }

  _refreshKeys() {
    if (this.state.loadedStore) {
      Crypto.getKeyAliases()
      .then(aliases => {
        console.log(aliases)
        this.setState({
          loadedStoreKeys: aliases
        })
      })
      .catch(error => {
        alert("Could not refresh keys")
      })
    }

  }

  newKeystore() {
   var aliasDialog = new DialogAndroid()
   var passDialog = new DialogAndroid()

   aliasDialog.set({
     title: "Alias",
     content: "Enter an alias for the keystore",
     input: {
      type: 1,
      callback: (alias) => {

        passDialog.set({
          title: "Password",
          content: "Please enter a password for the keystore",
          input: {
            type: 1,
            callback: password => {
              Crypto.createKeyStore(alias, password)
              .then(() => {
                alert("Created")
                this._refreshKeystores()
              })
              .catch(error => {
                alert(error)
              })
            }
          }
        })
        passDialog.show()
      }
     }
   })
   aliasDialog.show()


    // var name, password
    // this._askForInput("Keystore Name", "Enter a name", "Submit", (text) => {
    //   name = text
    //   this._askForInput("Keystore Password", "Enter password", "Submit", text => {
    //     password = text
    //     this._createKeystore(name, password)
    //   })
    // })
  }

  deleteKeystore() {
    const dialog = new DialogAndroid()
    dialog.set({
      items: this.state.stores,
      title: "Delete keystore",
      "positiveText": "Delete",
      itemsCallbackMultiChoice: (ids, names) => {
        if(ids.length <= 0) {
          // Nothing was selected
          alert("Nothing was selected")
          return
        }
        names.forEach(name => {
          Crypto.deleteKeyStore(name)
          .catch(error => alert(error))
        })
        alert("Deleted: " + JSON.stringify(names))
        if (names.find(x => x === this.state.loadedStore)) {
          this.setState({
            loadedStore: null
          })
        }
        this._refreshKeystores()
      }
    })
    dialog.show()
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

  loadKeystore() {
    const dialog = new DialogAndroid()
    dialog.set({
      items: this.state.stores,
      title: "Load keystore",
      "positiveText": "Load",
      itemsCallbackSingleChoice: (id, name) => {
        const dialog2 = new DialogAndroid()
        dialog2.set({
          title: "Enter pasword",
          content: "Please enter the keystore password",
          input: {
            type: 1,
            callback: (password) => {
              Crypto.loadKeyStore(name, password)
              .then(() => {
                this.setState({
                  loadedStore: name
                })
                alert(name + " loaded")
                this._refreshKeys()
              })
              .catch(error => {
                alert(error)
              })
            }
          },
          positiveText: "Okay",
          negativeText: "Cancel"
        })
        dialog2.show()
      }
    })
    dialog.show()
  }

  deleteKeys() {
    if(!this.state.loadedStore) {
      alert("Keystore must first be loaded")
      return
    }
    const dialog = new DialogAndroid()
    var deleted = new Array()
    dialog.set({
      items: this.state.loadedStoreKeys,
      content: "Select key(s) to delete",
      positiveText: "Delete",
      itemsCallbackMultiChoice: (id, names) => {
        names.forEach(x => {
          console.log("X", x)
          Crypto.deleteKeyEntry(x)
          .then((y) => {
            console.log("deleted", y)
            deleted.push(y)
          })
          .catch(error => {
            alert(error)
          })
        })
        setTimeout(() => {
          this._refreshKeys()
          alert(JSON.stringify(deleted) + " deleted")
        }, 200)
      }
    })
    dialog.show()
  }

  render() {
    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <View style={{ alignItems: 'center' }}>
            <H1>Keystore Manager</H1>
            <H2>Keystore</H2>
          </View>
          <Text>Available Stores: { this.state.stores.map(x => x + ", ")}</Text>
          <Text>Loaded Store: { this.state.loadedStore || "None" }</Text>
          <Button kind="squared" style={[styles.btn]} onPress={() => this.newKeystore()}> Create New KeyStore</Button>
          <Button kind="squared" style={[styles.btn]} onPress={() => this.deleteKeystore()}> Delete KeyStore</Button>
          <Button kind="squared" style={[styles.btn]} onPress={() => this.loadKeystore()}> Load KeyStore</Button>
          <View style={{ alignItems: 'center' }}>
            <H2>Keys</H2>
          </View>
          <Text>Keys in store: { this.state.loadedStoreKeys.map(x => x + ", ") || null}</Text>
          <Button kind="squared" style={[styles.btn]} onPress={() => this.newKey()}> New Keypair</Button>
          <Button kind="squared" style={[styles.btn]} onPress={() => this.deleteKeys()}>Delete Keys</Button>
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
