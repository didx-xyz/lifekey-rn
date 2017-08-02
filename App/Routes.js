
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
import Menu from './Scenes/Menu'
import HelpGeneral from './Scenes/HelpGeneral'
import FaceMatch from './Scenes/FaceMatch'
import SetPin from './Scenes/Onboarding/SetPin'
import Unlocked from './Scenes/Onboarding/Unlocked'
import ConnectionDetails from './Scenes/ConnectionDetails'
import Connection from './Scenes/Connection'
import ConnectionPeerToPeer from './Scenes/ConnectionP2P'
import ConnectionPeerToPeerRequest from './Scenes/ConnectionP2PRequest'
import ConnectionPeerToPeerDelete from './Scenes/ConnectionP2PDelete'
import ConnectionDetailsPeerToPeer from './Scenes/ConnectionDetailsP2P'
import InformationRequest from './Scenes/InformationRequest'
import Messages from './Scenes/Messages'
import EditResource from './Scenes/EditResource'
import EditProfile from './Scenes/EditProfile'
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
  menu: { scene: Menu },
  helpGeneral: { scene: HelpGeneral },
  faceMatch: { scene: FaceMatch },
  connectionDetails: { scene: ConnectionDetails },
  connection: { scene: Connection },
  connectionDetailsPeerToPeer: { scene: ConnectionDetailsPeerToPeer },
  connectionPeerToPeer: { scene: ConnectionPeerToPeer },
  connectionPeerToPeerDelete: { scene: ConnectionPeerToPeerDelete },
  connectionPeerToPeerRequest: { scene: ConnectionPeerToPeerRequest },
  informationRequest: { scene: InformationRequest },
  messages: { scene: Messages },
  editResource: { scene: EditResource },
  editProfile: { scene: EditProfile },
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
