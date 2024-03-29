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
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native'
import Camera from 'react-native-camera'
import BackButton from '../../Components/BackButton'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default class SelfieCam extends Scene {
  constructor(props) {
    super(props)
    this.state = {
      qrCaptured: false
    }
  }

  takePicture() {
    this.camera.capture()
    .then((result) => {
      alert("Image saved to " + result.path)
    })
    .catch((error) => {
      alert(error)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <BackButton navigator={this.navigator} />
        <Camera
          ref={(cam) => { this.camera = cam }}
          captureTarget={ Camera.constants.CaptureTarget.temp }
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          orientation={Camera.constants.Orientation.portrait}
          onBarCodeRead={(data) => this.onBarCodeRead(data)}
          type={Camera.constants.Type.front}
          // barCodeTypes={['aztec', 'qr']}
        >
            <Text style={styles.capture} onPress={() => this.takePicture()}><Icon size={32} name="camera"/></Text>
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
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
})
