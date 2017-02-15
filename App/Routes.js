/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Login from './Scenes/Login'
import Main from './Scenes/Main'
import ScanQRCode from './Scenes/ScanQRCode'
import Register from './Scenes/Register'
import Debug from './Scenes/Debug'
import SelfieCam from './Scenes/SelfieCam'
import KeypairGenerator from './Scenes/KeypairGenerator'
import FormGenerator from './Scenes/FormGenerator'
import ApiTest from './Scenes/ApiTest'
import Animation from './Scenes/Animation'
export default {
  login: { title: 'Login', scene: Login },
  main: { title: 'Main', scene: Main },
  scanQrCode: { title: 'Scan QR Code', scene: ScanQRCode },
  selfieCam: { title: 'Self-facing Camera', scene: SelfieCam },
  keyPairGenerator: { title: 'Keypair Generator', scene: KeypairGenerator },
  register: { title: 'Register', scene: Register },
  debug: { title: 'Debug', scene: Debug },
  formGenerator: { title: 'form generator', scene: FormGenerator },
  apiTest: { title: 'API Test', scene: ApiTest },
  animation: { title: 'Animation', scene: Animation }
}
