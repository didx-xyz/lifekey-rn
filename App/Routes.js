/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

// Debug
import DebugMain from './Scenes/Debug/DebugMain'
import DebugKeyStore from './Scenes/Debug/DebugKeyStore'
import DebugRegister from './Scenes/Debug/DebugRegister'
import DebugError from './Scenes/Debug/DebugError'

// Main
import Main from './Scenes/Main'
import Me from './Scenes/Me'
import SetPin from './Scenes/Onboarding/SetPin'
import Unlocked from './Scenes/Onboarding/Unlocked'
import ConnectionDetails from './Scenes/ConnectionDetails'
import ConfirmInformationShare from './Scenes/ConfirmInformationShare'
import Connection from './Scenes/Connection'
import InformationRequest from './Scenes/InformationRequest'
import SelectResourceOfType from './Scenes/SelectResourceOfType'
import Badges from './Scenes/Badges'

import Locked from './Scenes/Onboarding/Locked'
import Unlock from './Scenes/Onboarding/Unlock'

// Onboarding
import SplashScreen from './Scenes/Onboarding/SplashScreen'
import Register from './Scenes/Onboarding/Register'

// Camera
import QRCodeScanner from './Scenes/Camera/QRCodeScanner'
import SelfieCam from './Scenes/Camera/SelfieCam'

export default {
  main: { scene: Main },
  me: { scene: Me },
  connectionDetails: { scene: ConnectionDetails },
  confirmInformationShare: { scene: ConfirmInformationShare },
  connection: { scene: Connection },
  informationRequest: { scene: InformationRequest },
  selectResourceOfType: { scene: SelectResourceOfType },
  badges: { scene: Badges },
  debugKeyStore: { scene: DebugKeyStore },
  debugRegister: { scene: DebugRegister },
  onboarding: {
    splashScreen: { scene: SplashScreen },
    register: { scene: Register },
    setPin: { scene: SetPin },
    unlocked: { scene: Unlocked },
    locked: { scene: Locked },
    unlock: { scene: Unlock }
  },
  camera: {
    selfieCam: { scene: SelfieCam },
    qrCodeScanner: { scene: QRCodeScanner }
  },
  debug: {
    main: { scene: DebugMain },
    register: { scene: DebugRegister },
    error: { scene: DebugError }
  }
}
