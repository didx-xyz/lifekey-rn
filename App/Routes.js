/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

// Debug
import Login from './Scenes/Login'
import Main from './Scenes/Main'
import ScanQRCode from './Scenes/ScanQRCode'
import Debug from './Scenes/Debug'
import SelfieCam from './Scenes/SelfieCam'
import DebugKeyStore from './Scenes/DebugKeyStore'
import FormGenerator from './Scenes/FormGenerator'
import DebugRegister from './Scenes/DebugRegister'
import Animation from './Scenes/Animation'
import DebugConnectionRequest from './Scenes/DebugConnectionRequest'
import DebugShowQRCode from './Scenes/DebugShowQRCode'
import DebugPushNotifications from './Scenes/DebugPushNotifications'
import DebugViewConnectionRequests from './Scenes/DebugViewConnectionRequests'
import DebugViewConnections from './Scenes/DebugViewConnections'
import DebugListAllResources from './Scenes/DebugListAllResources'

// Main
import BlankSceneTemplate from './Scenes/BlankSceneTemplate'
import SplashScreen from './Scenes/Onboarding/SplashScreen'
import QRCodeScanner from './Scenes/Camera/QRCodeScanner'
import Register from './Scenes/Onboarding/Register'
import SetPin from './Scenes/Onboarding/SetPin'
import Unlocked from './Scenes/Onboarding/Unlocked'
import Me from './Scenes/Me'

import Locked from './Scenes/Onboarding/Locked'
import Unlock from './Scenes/Onboarding/Unlock'

export default {
  // Debug
  blankSceneTemplate: { title: 'Blank Scene Template', scene: BlankSceneTemplate },
  login: { title: 'Login', scene: Login },
  main: { title: 'Main', scene: Main },
  me: { title: 'Main', scene: Me },
  scanQrCode: { title: 'Scan QR Code', scene: ScanQRCode },
  selfieCam: { title: 'Self-facing Camera', scene: SelfieCam },
  debugKeyStore: { title: 'Keypair Generator', scene: DebugKeyStore },
  debug: { title: 'Debug', scene: Debug },
  formGenerator: { title: 'form generator', scene: FormGenerator },
  debugRegister: { title: 'register', scene: DebugRegister },
  animation: { title: 'Animation', scene: Animation },
  debugConnectionRequest: { title: 'Connection request', scene: DebugConnectionRequest },
  debugShowQRCode: { title: "Show QR Code", scene: DebugShowQRCode },
  debugPushNotifications: { title: "Push notifications", scene: DebugPushNotifications },
  debugViewConnectionRequests: { title: 'View Connection Requests', scene: DebugViewConnectionRequests },
  debugViewConnections: { title: 'Connections', scene: DebugViewConnections },
  debugListAllResources: {title: 'List All Resources', scene: DebugListAllResources},

  // Main
  onboarding: {
    splashScreen: { scene: SplashScreen },
    register: { scene: Register },
    setPin: { scene: SetPin },
    unlocked: { scene: Unlocked },
    locked: { scene: Locked },
    unlock: { scene: Unlock }
  },
  camera: {
    qrCodeScanner: { scene: QRCodeScanner }
  }
}
