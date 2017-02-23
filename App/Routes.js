/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

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
export default {
  login: { title: 'Login', scene: Login },
  main: { title: 'Main', scene: Main },
  scanQrCode: { title: 'Scan QR Code', scene: ScanQRCode },
  selfieCam: { title: 'Self-facing Camera', scene: SelfieCam },
  debugKeyStore: { title: 'Keypair Generator', scene: DebugKeyStore },
  debug: { title: 'Debug', scene: Debug },
  formGenerator: { title: 'form generator', scene: FormGenerator },
  debugRegister: { title: 'register', scene: DebugRegister },
  animation: { title: 'Animation', scene: Animation },
  debugConnectionRequest: { title: 'Connection request', scene: DebugConnectionRequest },
  debugShowQRCode: { title: "Show QR Code", scene: DebugShowQRCode }
}
