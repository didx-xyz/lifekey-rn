/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Palette from '../../Palette'
import CameraCrosshair from '../../Components/CameraCrosshair'
import {
  Text,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator
} from 'react-native'

import {
  Col,
  Grid
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'
import Camera from 'react-native-camera'

export default class QRCodeScanner extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      showCamera: false
    }
  }

  _hardwareBackHandler() {
    this.navigator.pop()
    return true
  }

  componentDidMount() {
    super.componentDidMount()
    InteractionManager.runAfterInteractions(() =>
      setTimeout(() =>
        this.setState({ showCamera: true }),
        500
      )
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AndroidBackButton onPress={() => this._hardwareBackHandler()}/>
        { this.state.showCamera ?
        <Camera
          ref={(cam) => { this.camera = cam }}
          style={style.camera}
          aspect={Camera.constants.Aspect.fill}
          orientation={Camera.constants.Orientation.portrait}
          onBarCodeRead={(data) => {
            alert(JSON.stringify(data))
            this.setState({
              showCamera: false
            })
            // this.scanQR(data)
            // this.crosshair.bounce()
          }}
          type={Camera.constants.Type.back}
          barCodeTypes={['qr']}
        >
          <CameraCrosshair ref={(crosshair) => { this.crosshair = crosshair }} width={250} height={250} color={'white'}/>
        </Camera>
        :
        <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
          <ActivityIndicator animating={true}/>
        </View>
        }
        <View style={style.boxBottom}>
          <Grid>
            <Col>
              <TouchableNativeFeedback
                background={ TouchableNativeFeedback.Ripple('white', false) }
                onPress={() => this.navigator.pop()}
              >
                <View style={style.buttonView} >
                  <Text style={[style.buttonText]}>Cancel</Text>
                </View>
              </TouchableNativeFeedback>
            </Col>
              <Col>
                <View style={style.buttonView} />
              </Col>
            </Grid>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  camera: {
    flex: 8
  },
  boxBottom: {
    flex: 2,
    backgroundColor: Palette.consentBlue
  },
  boxCrosshair: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  crosshair: {
    borderColor: 'white'
  },
  crosshairTopRight: {
    borderTopWidth: 0.7,
    borderRightWidth: 0.7
  },
  crosshairTopLeft: {
    borderTopWidth: 0.7,
    borderLeftWidth: 0.7
  },
  crosshairBottomRight: {
    borderBottomWidth: 0.7,
    borderRightWidth: 0.7
  },
  crosshairBottomLeft: {
    borderBottomWidth: 0.7,
    borderLeftWidth: 0.7
  },

  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white'
  }
})
