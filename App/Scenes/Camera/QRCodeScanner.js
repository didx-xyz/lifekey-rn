/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Palette from '../../Palette'
import Api from '../../Api'
import CameraCrosshair from '../../Components/CameraCrosshair'
import {
  Text,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  StatusBar
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
      showCamera: false,
      scannerActive: true
    }
  }
  _onAttention() {
    StatusBar.setHidden(true)
  }

  componentWillMount() {
    super.componentWillMount()
    this._onAttention()
  }

  componentWillFocus() {
    super.componentWillFocus()
    this._onAttention()

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

  _onBarCodeRead(data) {
    // alert(data)
    if (this.state.scannerActive) {
      Api.requestConnection({ target: data.data })
      .then(() => {
        alert('Request sent')
        this.setState({
          scannerActive: false
        })
      })
      .catch(error => {
        alert(JSON.stringify(error))
        this.setState({
          scannerActive: false
        })
      })
    }
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
          onBarCodeRead={(data) => this._onBarCodeRead(data)}
          type={Camera.constants.Type.back}
          barCodeTypes={['qr']}
        >
          { this.state.scannerActive ?
          <CameraCrosshair ref={(crosshair) => { this.crosshair = crosshair }} width={250} height={250} color={'white'}/>
          : null }
        </Camera>
        :
        <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
          <ActivityIndicator animating={true}/>
          <Text style={{ color: Palette.consentGrayLightest }}>Loading...</Text>
        </View>
        }
        <View style={style.boxBottom}>
          <Grid>
            <Col>
              <TouchableNativeFeedback
                background={ TouchableNativeFeedback.Ripple(Palette.consentGrayLightest, false) }
                onPress={() => this.navigator.pop()}
                delayPressIn={0}
              >
                <View style={style.buttonView} >
                  <Text style={[style.buttonText]}>Cancel</Text>
                </View>
              </TouchableNativeFeedback>
            </Col>
              <Col>
                { this.state.scannerActive ?
                <View style={style.buttonView} />
                :
                <TouchableNativeFeedback
                background={ TouchableNativeFeedback.Ripple(Palette.consentGrayLightest, false) }
                onPress={() => this.setState({ scannerActive: true })}
                delayPressIn={0}
                >
                  <View style={style.buttonView} >
                    <Text style={[style.buttonText]}>Scan</Text>
                  </View>
                </TouchableNativeFeedback>
                }
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
    color: 'white',
    fontSize: 20
  }
})
