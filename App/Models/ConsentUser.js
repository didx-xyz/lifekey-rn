/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import { Platform, AsyncStorage } from 'react-native'
import Session from '../Session'
import Crypto from '../Crypto'
import Logger from '../Logger'
import Config from '../Config'
import Api from '../Api'
import ConsentConnection from './ConsentConnection'
import ConsentConnectionRequest from './ConsentConnectionRequest'
import ConsentDiscoveredUser from './ConsentDiscoveredUser'

export default class ConsentUser {

  static storageKey = 'user'
  static filename = 'ConsentUser.js'

  static get() {
    return AsyncStorage.getItem(ConsentUser.storageKey)
    .then(itemJSON => {
      try {
        const user = JSON.parse(itemJSON)
        if (user) {
          return Promise.resolve(user)
        }
      } catch(error) {
        // json parse error
        return Promise.reject(error)
      }
    })
  }

  static login(password) {
    // load keys
    // set password in state
    // set loggedIn true in state
    return Crypto.loadKeyStore(Config.keystore.name, password)
    .then(loadedKeystore => {
      Logger.info('Keystore loaded, user verified', this.filename)
      const update = {}
      update[ConsentUser.storageKey] = {
        password: password,
        loggedIn: true
      }
      Session.update(update)
      return Promise.resolve()
    })
    .catch(error => {
      return Promise.reject(error)
    })
  }

  static logout() {
    // YOU CAN NEVER LEAVE CONSENT
    // Clear password from session
    // maybe unload keystore?
  }

  static getToken() {
    return AsyncStorage.getItem(ConsentUser.storageKey)
    .then(userJSON => {
      if (userJSON) {
        const user = JSON.parse(userJSON)
        if (!user || !user.firebaseToken) {
          return Promise.resolve(null)
        } else {
          return Promise.resolve(user.firebaseToken)
        }
      } else {
        return Promise.resolve(null)
      }
    })
  }

  static setToken(firebaseToken) {
    let toSign
    return AsyncStorage.getItem(ConsentUser.storageKey)
    .then(userJSON => {
      // It existed before
      if (userJSON) {
        const user = JSON.parse(userJSON)

        const updatedUser = Object.assign(user, { firebaseToken })
        return AsyncStorage.setItem(ConsentUser.storageKey, JSON.stringify(updatedUser))
      } else {
        // set it for the first time
        return AsyncStorage.setItem(ConsentUser.storageKey, JSON.stringify({ firebaseToken: firebaseToken }))
      }
    })
    .then(error => {
      if(error) {
        return Promise.reject(error)
      } else {
        Logger.firebase(`Token updated ${firebaseToken}`)
        // We gotta notify the server if we can
        return ConsentUser.isRegistered()

      }
    })
    .then(registered => {
      if (registered) {
        Logger.firebase('Notifying server of token update')
        return Crypto.loadKeyStore(Config.keystore.name, ConsentUser.getPassword())
      } else {
        return Promise.reject('Must be registered to notify server of token update')
      }
    })
    // Get secure random
    .then(name => {
      Logger.firebase('Getting secure random...')
      return Crypto.secureRandom()
    })
    // Sign
    .then(randomBytes => {
      toSign = randomBytes
      Logger.firebase('Signing...')
      return Crypto.sign(
        toSign,
        Config.keystore.privateKeyName,
        ConsentUser.getPassword(),
        Crypto.SIG_SHA256_WITH_RSA
      )
    })

    .then(signature => {
      Logger.firebase('Sending to server...')
      return Api.device({
        user_id: ConsentUser.getId(),
        plain: toSign,
        signature: signature,
        device_id: firebaseToken,
        device_platform: `${Config.APP_NAME} ${Platform.OS} v${Config.version}`
      })
    })
    .then(response => {
      if (response.error) {
        return Promise.reject('Server responded with error ' + JSON.stringify(response.error))
      } else {
        return Promise.resolve('Server notified of token update')
      }
    })
  }

  static getPassword() {
    const state = Session.getState()
    if (!state || !state.user || !state.user.password) {
      throw 'No password set, user is not logged in'
    } else {
      return state.user.password
    }
  }

  /*
   * We need this function because DIDs are received through their
   * own channel and may only be received at a later time after registration
   */
  static setDid(did) {
    return AsyncStorage.getItem(ConsentUser.storageKey)
    .then(itemJSON => {
      if (itemJSON) {
        try {
          const user = JSON.parse(itemJSON)
          const userUpdate = Object.assign(user, { did })
          return AsyncStorage.setItem(ConsentUser.storageKey, JSON.stringify(userUpdate))
        } catch (error) {
          return Promise.reject(error)
        }

      } else {
        // create first record
        return AsyncStorage.setItem(ConsentUser.storageKey, JSON.stringify({ did }))
      }
    })
    .then(error => {
      if (error) {
        return Promise.reject(error)
      } else {
        return Promise.resolve(did)
      }
    })
  }

  static getId() {
    const state = Session.getState()
    if (!state || !state.user || !state.user.id) {
      return null
    } else {
      return state.user.id
    }
  }

  static unregister() {
    let firebaseToken
    return AsyncStorage.getItem(ConsentUser.storageKey)
    .then(itemJSON => {
      const user = JSON.parse(itemJSON)
      if (user) {
        // Preserve firebase token
        firebaseToken = user.firebaseToken
        if (user.id) {
          return Api.unregister({ id: user.id })
        } else if (user.email) {
          return Api.unregister({ email: encodeURI(user.email) })
        } else {
          return Promise.reject('Nothing to delete by')
        }
      } else {
        return Promise.reject('Nothing to delete')
      }
    })
    .then(responseJson => {
      return Promise.all([
        Crypto.deleteKeyStore(Config.keystore.name),
        AsyncStorage.multiRemove([
          ConsentUser.storageKey,
          ConsentConnection.storageKey,
          ConsentConnectionRequest.storageKey,
          ConsentDiscoveredUser.storageKey
        ])
      ])
    })
    .then(results => {
      if (results[1]) {
        if (results[1].error) {
          Logger.error('Could not purge databases', this.filename, results[1].error)
        }
      } else {
        return AsyncStorage.setItem(ConsentUser.storageKey, {
          user: { firebaseToken: firebaseToken }
        })
        // return Promise.resolve()
      }
    })
  }

  static register(username, email, password) {

    let publicKeyPem, firebaseToken, toSign, userID
    Logger.info(`Registering as: ${username}, ${email}, ${password}`, this.filename)

    return ConsentUser.getToken()
    .then(_firebaseToken => {
      if (_firebaseToken) {
        Logger.info('Fetching secure random', this.filename)
        firebaseToken = _firebaseToken
        return Crypto.getKeyStoreList()
      } else {
        Logger.firebase('No firebase token available', this.filename)
        return Promise.reject('No token available. Cannot register')
      }
    })

    // Check if already registered
    .then(keystoreList => {
      const exists = keystoreList.find(x => x === Config.keystore.name)
      if (exists) {
        // We delete it
        return Crypto.deleteKeyStore(Config.keystore.name)
        .then(() => {
          return Crypto.createKeyStore(Config.keystore.name, password)

        })
      } else {
        Logger.info('Creating new keystore', this.filename)
        return Crypto.createKeyStore(Config.keystore.name, password)
      }
    })

    // Create the user's keypair
    .then(() => {
      Logger.info('Creating keypair', this.filename)
      return Crypto.addKeyPair(
        Crypto.KEYPAIR_RSA,
        Config.keystore.keyName,
        2048,
        password,
        Config.keystore.pemCertificatePath
      )
    })

    // Get public key in PEM format
    .then(_keys => {
      Logger.info('Converting public key to PEM format', this.filename)
      return Crypto.getKeyAsPem(Config.keystore.publicKeyName, password)
    })

    // Get firebase token
    .then(_publicKeyPem => {
      publicKeyPem = _publicKeyPem
      Logger.info('Fetching secure random', this.filename)
      return Crypto.secureRandom()
    })

    // Sign with private key
    .then(_secureRandom => {
      Logger.info('Signing...', this.filename)
      toSign = _secureRandom
      return Crypto.sign(
        toSign,
        Config.keystore.privateKeyName,
        password,
        Crypto.SIG_SHA256_WITH_RSA
      )
    })

    // Send to server
    .then(signature => {
      Logger.info('Sending details to server', this.filename)
      return Api.register({
        email: email.trim(),
        nickname: username.trim(),
        device_id: firebaseToken,
        device_platform: Platform.OS,
        public_key_algorithm: Config.keystore.publicKeyAlgorithm,
        public_key: publicKeyPem,
        plaintext_proof: toSign,
        signed_proof: signature
      })
    })

    // Get response from server
    .then(response => {
      if (response.error === true) {
        // Server rejected registration
        // Remove keystore
        Logger.info('Registration on server failed', this.filename)
        Logger.info('Deleting keystore', this.filename)
        return Crypto.deleteKeyStore(Config.keystore.name)
        .then(() => {
          return Promise.reject(response.error)
        })
      }
      const jsonData = response.body
      // TODO: check server response
      // user could already exist etc
      Logger.info('Server responded', this.filename)
      userID = jsonData.id

      // See what's currently in the DB
      return AsyncStorage.setItem(ConsentUser.storageKey, JSON.stringify({
        id: userID,
        email: email,
        firebaseToken: firebaseToken,
        registered: true
      }))
    })

    // Check that writing went well and resolve
    .then(error => {
      if (error) {
        // If we couldn't write to database
        Logger.error('Could not write to AsyncStorage', this.filename, error)
        return Promise.reject(error)
      } else {
        // Update state
        const sessionUpdate = {
          user: {
            id: userID,
            password: password,
            email: email,
            registered: true,
            loggedIn: true
          }
        }
        Session.update(sessionUpdate)
        Logger.info('User registered', this.filename)
        return Promise.resolve({
          id: userID
        })
      }
    })
  }

  static isLoggedIn() {
    return new Promise((resolve, reject) => {
      // For a user to be "logged in" we need their password in memory
      // without this password we cannot sign and cannot "do" anything
      const state = Session.getState()
      if (!state || !state.user || !state.user.password) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  }

  static isRegistered() {
    return AsyncStorage.getItem(ConsentUser.storageKey)
    .then(itemJSON => {
      if (!itemJSON) {
        return Promise.resolve(false)
      } else {
        const consentUser = JSON.parse(itemJSON)
        if (!consentUser || !consentUser.email || !consentUser.id) {
          return Promise.resolve(false)
        } else {
          return Promise.resolve(true)
        }
      }

    })
  }
}
