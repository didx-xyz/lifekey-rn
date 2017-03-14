/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Session from '../Session'
import Config from '../Config'
import Routes from '../Routes'
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native'
import * as NB from 'native-base'
import Camera from 'react-native-camera'
const t = require('tcomb-form-native')
const Form = t.form.Form
import BackButton from '../Components/BackButton'


export default class ScanQRCode extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      qrCaptured: false
    }
  }

  goToDisplayForm(formData) {
    this.setState({ qrCaptured: false })
    this.navigator.push({ ...Routes.displayForm, formData: formData })
  }

  onBarCodeRead(data) {
    if (!this.state.qrCaptured) {
      this.setState({
        qrCaptured: true
      })
      Alert.alert(
        'DATA',
        JSON.stringify(data),
        [{ text: 'Dismiss', onPress: () => this.setState({ qrCaptured: false }) }]
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <BackButton navigator={this.navigator} />
        <Camera
          ref={(cam) => { this.camera = cam }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          orientation={Camera.constants.Orientation.portrait}
          onBarCodeRead={(data) => this.onBarCodeRead(data)}
          type={Camera.constants.Type.rear}
          // barCodeTypes={['aztec', 'qr']}
        >
          <View style={{ flex: 1, alignItems: 'center', borderColor: 'green', borderWidth: 1, margin: 30, width: Dimensions.get('window').width - 30 }}>
            <Text style={{ color: 'white' }}>Place QR code in this box</Text>
          </View>
        </Camera>
      </View>
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
  }
})
