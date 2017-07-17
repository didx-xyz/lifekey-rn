/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Routes from '../../Routes'
import Palette from '../../Palette'
import Api from '../../Api'
import CameraCrosshair from '../../Components/CameraCrosshair'
import LifekeyFooter from '../../Components/LifekeyFooter'
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
      readyToScan: true
    }
    this.scannerActive = true
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

  _preventOverheat() {
    // Turn of after 5 minutes
    setTimeout(() => {
      this.setState({ showCamera: false , readyToScan: false })
    }, (100 * 10) * 60 * 5)
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

  faceMatch(data) {

    this.navigator.push({
      ...Routes.faceMatch,
      url: data.data
    })
  }

  // connect(data) {
  //   this.navigator.push({
  //     ...Routes.connection,
  //     did: data.data,
  //     display_name: null // can either be in QR code or fetched http
  //   })
  // }

  connectP2P(data) {
    const parsedData = JSON.parse(data.data)
    this.navigator.push({
      ...Routes.ConnectionPeerToPeer,
      profile: parsedData
    })
  }

  trustBankLogin(data) {
    
    console.log("TRUSTBANK 1: ", data.data)
    const parsedData = JSON.parse(data.data)

    return Api.trustBankLogin(parsedData).then(response => {

      if(response.requestSuccesfullySent){
        alert("Logging in...")
        this.navigator.push({...Routes.main})
      }
      else{

      }

    }).catch(error => {
      alert("Log in request failed: ", data.error)
      Logger.error(error)
    })

  }

  _onBarCodeRead(data) {

    console.log("DATA: ", data)
    

    if (this.scannerActive) {
      this.scannerActive = false

      // Here we need to build a switch that identifies the nature of the request 
      const isFaceMatch = data.data.indexOf('facial-verification')
      const isTrustBankLogin = data.data.indexOf('challenge')

      if(isFaceMatch > -1){
        this.faceMatch(data)
      }
      else if(isTrustBankLogin > -1){
        this.trustBankLogin(data)
      }
      else
        this.connectP2P(data)
    }
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
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
            <CameraCrosshair ref={(crosshair) => { this.crosshair = crosshair }} width={250} height={250} color={'white'}/>
          </Camera>
          :
          <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
            <ActivityIndicator animating={true}/>
            <Text style={{ color: Palette.consentGrayLightest }}>Loading...</Text>
          </View>
        }
        <LifekeyFooter
          backgroundColor={ Palette.consentBlue }
          leftButtonText="Cancel"
          onPressLeftButton={() => this.navigator.pop()}
        />
        { /* <View style={style.boxBottom}>
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
                { this.state.readyToScan ?
                <View style={style.buttonView} />
                :
                <TouchableNativeFeedback
                background={ TouchableNativeFeedback.Ripple(Palette.consentGrayLightest, false) }
                onPress={() => {
                  this.scannerActive = true
                  this.setState({ readyToScan: true, showCamera: true })
                }}
                delayPressIn={0}
                >
                  <View style={style.buttonView} >
                    <Text style={[style.buttonText]}>Scan again</Text>
                  </View>
                </TouchableNativeFeedback>
                }
              </Col>
            </Grid>
        </View> */}
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
