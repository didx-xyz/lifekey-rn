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
import DebugConfiguration from './Scenes/Debug/DebugConfiguration'
import DebugConnectionRequest from './Scenes/Debug/DebugConnectionRequest'
import DebugAsyncStorage from './Scenes/Debug/DebugAsyncStorage'
import DebugSvg from './Scenes/Debug/DebugSvg'
import DebugCreateIsa from './Scenes/Debug/DebugCreateIsa'
import DebugListIsas from './Scenes/Debug/DebugListIsas'

// Main
import Main from './Scenes/Main'
import Me from './Scenes/Me'
import HelpGeneral from './Scenes/HelpGeneral'
import HelpScreens from './Scenes/Onboarding/HelpScreens'
import MeConnect from './Scenes/MeConnect'
import FaceMatch from './Scenes/FaceMatch'
import FaceMatchResult from './Scenes/FaceMatchResult'
import SetPin from './Scenes/Onboarding/SetPin'
import Unlocked from './Scenes/Onboarding/Unlocked'
import ConnectionDetails from './Scenes/ConnectionDetails'
import ConfirmInformationShare from './Scenes/ConfirmInformationShare'
import Connection from './Scenes/Connection'
import InformationRequest from './Scenes/InformationRequest'
import SelectResourceOfType from './Scenes/SelectResourceOfType'
import Badges from './Scenes/Badges'
import Messages from './Scenes/Messages'
import BadgeDetail from './Scenes/BadgeDetail'
import EditResource from './Scenes/EditResource'
import Thanks from './Scenes/Thanks'
import AuthenticationPrompt from './Scenes/AuthenticationPrompt'

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
  helpGeneral: { scene: HelpGeneral },
  helpScreens: { scene: HelpScreens },
  meConnect: { scene: MeConnect },
  faceMatch: { scene: FaceMatch },
  faceMatchResult: { scene: FaceMatchResult },
  connectionDetails: { scene: ConnectionDetails },
  confirmInformationShare: { scene: ConfirmInformationShare },
  connection: { scene: Connection },
  informationRequest: { scene: InformationRequest },
  selectResourceOfType: { scene: SelectResourceOfType },
  badges: { scene: Badges },
  messages: { scene: Messages },
  badgeDetail: { scene: BadgeDetail },
  editResource: { scene: EditResource },
  thanks: {scene: Thanks},
  authenticationPrompt: {scene: AuthenticationPrompt},
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
    keystore: { scene: DebugKeyStore },
    register: { scene: DebugRegister },
    configuration: { scene: DebugConfiguration },
    connectionRequest: { scene: DebugConnectionRequest },
    asyncStorage: { scene: DebugAsyncStorage },
    svg: { scene: DebugSvg },
    createIsa: { scene: DebugCreateIsa },
    listIsas: { scene: DebugListIsas }
  }
}
