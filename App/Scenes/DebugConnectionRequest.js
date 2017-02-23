/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'
import Config from '../Config'

import {
  Text,
  Dimensions,
  View,
  StyleSheet
} from 'react-native'

import {
  Container,
  Content,
} from 'native-base'
import {
  Button,
  H1
} from 'nachos-ui'
import Camera from 'react-native-camera'
import AndroidBackButton from 'react-native-android-back-button'
import DialogAndroid from 'react-native-dialogs'

export default class DebugConnectionRequest extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      ready: false
    }
  }

  componentDidMount() {
    this.setState({
      ready: true
    })
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  requestConnection() {
    this.setState({
      ready: false
    })
    fetch(Config.http.baseUrl + "/management/connection", {
      body: JSON.stringify({
        target: 123
      }),
      method: "POST",
      "content-type": "application/json"
    })
    .then(response => {

    })
    .catch(error => alert(error))
  }

  pullProfile(data) {
    // alert(data); return
    console.log("fetching: http://" + data)
    fetch("http://" + data, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
    .then(response => {
      console.log(response)
      alert(response._bodyText)
      // this.setState({ ready: true })
    })
    .catch(error => {
      alert(error)
      // this.setState({ ready: true })
    })

  }

  scanQR(data) {
    if (!this.state.ready) {
      return
    }
    this.setState({
      ready: false
    })
    this.pullProfile(data.data)
  }

  render() {
    return (
      <Container>
        <Content>
          <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
          <Camera
            ref={(cam) => { this.camera = cam }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            orientation={Camera.constants.Orientation.portrait}
            onBarCodeRead={(data) => this.scanQR(data)}
            type={Camera.constants.Type.rear}
            barCodeTypes={['qr']}
          >
            <View style={{ flex: 1, alignItems: 'center', borderColor: "#00ff00", borderWidth: 1, marginTop: 150, marginBottom: 150, width: Dimensions.get('window').width - 30 }}>
              <Text style={{ color: 'white' }}>Scan Lifekey QR Code</Text>
              { this.state.ready ?
                null :
                <Button iconName="md-refresh" style={[styles.btn]} onPress={() => this.setState({ ready: true })}>Try again</Button>
              }
            </View>

          </Camera>
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
