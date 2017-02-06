/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Login from './Scenes/Login'
import Main from './Scenes/Main'
import ScanQRCode from './Scenes/ScanQRCode'
import DisplayForm from './Scenes/DisplayForm'
import Register from './Scenes/Register'
import Debug from './Scenes/Debug'

export default {
  login: { title: 'Login', scene: Login },
  main: { title: 'Main', scene: Main },
  scanQrCode: { title: 'Scan QR Code', scene: ScanQRCode },
  displayForm: { title: 'Display Form', scene: DisplayForm },
  register: { title: 'Register', scene: Register },
  debug: { title: 'Debug', scene: Debug }
}
