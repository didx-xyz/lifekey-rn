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
import ConsentError from '../ConsentError'
import Firebase from 'react-native-firebase'

export const E_MUST_BE_REGISTERED = 0x01
export const E_INCORRECT_PASSWORD_FOR_KEYSTORE = 0x02
export const E_DOES_NOT_EXIST_ON_SERVER = 0x03
export const E_COULD_NOT_LOGOUT = 0x04
export const E_USER_DOES_NOT_EXIST = 0x05
export const E_NO_FIREBASE_TOKEN = 0x06
export const E_COULD_NOT_SET_ITEM = 0x07
export const E_SERVER_ERROR = 0x08
export const E_MUST_BE_LOGGED_IN = 0x09
export const E_NOTHING_TO_DELETE_BY = 0x0a
export const E_NOTHING_TO_DELETE = 0x0b

const STORAGE_KEY = 'user'
const LOGTAG = 'ConsentUser'

export default class ConsentUser {

  static storageKey = 'user'
  static filename = 'ConsentUser.js'

  /**
   * Get the device user
   * @param {number} id The id of the user
   * @returns {object} user The user
   * @throws {Error} E_USER_DOES_NOT_EXIST
   */
  static get() {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      try {
        const user = JSON.parse(itemJSON)
        if (user) {
          return Promise.resolve(user)
        }
      } catch (error) {
        // json parse error
        return Promise.reject(
          new ConsentError(error, E_USER_DOES_NOT_EXIST)
        )
      }
    })
  }

  /**
   * Log the user in
   * @param {string} password The password or pin of the keystore
   * @returns {object} user The user's details
   * @throws E_MUST_BE_REGISTERED
   *         E_INCORRECT_PASSWORD_FOR_KEYSTORE
   *         E_DOES_NOT_EXIST_ON_SERVER
   */
  static login(password) {
    let user

    // Get from model
    return ConsentUser.get()
    .then(_user => {

      user = _user
      if (user.registered) {

        // Try to unlock keystore
        return Crypto.loadKeyStore(Config.keystore.name, password)

      } else {

        // Trying to loging without being registered
        return Promise.reject(
          new ConsentError(
            'Cannot log in of not registered',
            E_MUST_BE_REGISTERED
          )
        )

      }
    })
    .then(loadedKeystore => {
      if (loadedKeystore) {

        // Unlocked keystore with password
        Logger.info('Keystore loaded, password verified', LOGTAG)
        // Check if user exists on the other side
        return Api.profile({ did: user.did })

      } else {

        // Wrong password
        return Promise.reject(
          new ConsentError(
            'Incorrect password for keystore',
            E_INCORRECT_PASSWORD_FOR_KEYSTORE
          )
        )

      }
    })
    .then(response => {
      if (parseInt(response.status, 10) === 200) {

        // profile exists too, seems legit, log them in
        const update = {}
        update[STORAGE_KEY] = {
          password: password,
          loggedIn: true
        }
        Session.update(update)

        return Promise.resolve(user)
      } else {
        // No such user on server
        Promise.reject(
          new ConsentError('User does not exist on server', E_DOES_NOT_EXIST_ON_SERVER)
        )
      }
    })
  }

  /**
   * Log the user out
   * Unload the keystore, requiring a password to use it again
   * also remove the password from session and set loggedIn false
   * @returns {undefined}
   * @throws E_COULD_NOT_LOGOUT
   */
  static logout() {
    return Crypto.unloadKeyStore()
    .then(() => {
      Session.update({ user: { loggedIn: false, password: '' } })
      return Promise.resolve()
    })
    .catch(error => {
      return Promise.reject(
        new ConsentError(error, E_COULD_NOT_LOGOUT)
      )
    })
  }

  /**
   * Get the user's Firebase token
   * @returns {string} firebaseToken The firebase token
   * TODO: Check RAM first then fallback to sqlite
   */
  static getToken() {
    return AsyncStorage.getItem(STORAGE_KEY)
      .then(json => {
        if (json !== null) {
          const user = JSON.parse(json)

          if (user && user.firebaseToken) {
            return Promise.resolve(user.firebaseToken)
          }
        }

        let token = null
        const firebase = new Firebase()

        return firebase.messaging().getToken()
          .then(_token => {
            token = _token

            return AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ firebaseToken: token })
            )
          })
          .then(_ => {
            return Promise.resolve(token)
          })
          .catch(e => {
            throw new ConsentError(
              'No firebase token available',
              E_NO_FIREBASE_TOKEN
            )
          })
      })
  }

  /**
   * Set the user's Firebase token
   * @param {string} firebaseToken The firebase token
   */
  static setToken(firebaseToken) {
    let toSign
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(userJSON => {
      // It existed before
      if (userJSON) {
        const user = JSON.parse(userJSON)

        const updatedUser = Object.assign(user, { firebaseToken })
        return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
      } else {
        // set it for the first time
        return AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ firebaseToken: firebaseToken })
        )
      }
    })
    .then(error => {
      if (error) {
        // return Promise.reject(error)
        return Promise.reject(
          new ConsentError(
            'Could not save record',
            E_COULD_NOT_SET_ITEM
          )
        )
      } else {
        Logger.firebase(`Token updated ${firebaseToken}`)
        // We gotta notify the server if we can
        return ConsentUser.isRegistered()

      }
    })
    .then(registered => {
      if (registered) {
        Logger.firebase('Notifying server of token update')
        return Crypto.loadKeyStore(Config.keystore.name, ConsentUser.getPasswordSync())
      } else {
        return Promise.reject(new Error('Must be registered to notify server of token update'))
      }
    })
    // Get secure random
    .then(_keystoreName => {
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
        ConsentUser.getPasswordSync(),
        Crypto.SIG_SHA256_WITH_RSA
      )
    })

    .then(signature => {
      Logger.firebase('Sending to server...')
      return Api.device({
        user_id: ConsentUser.getIdSync(),
        user_did: ConsentUser.getDidSync(),
        plain: toSign,
        signature: signature,
        device_id: firebaseToken,
        device_platform: Platform.OS
      })
    })
    .then(response => {
      if (response.error) {
        return Promise.reject(
          new ConsentError('Server responded with error', E_SERVER_ERROR)
        )
      } else {
        return Promise.resolve('Server notified of token update')
      }
    })
  }

  static getDisplayNameSync() {
    const state = Session.getState()
    if(! state || !state.user || !state.user.display_name) {
      throw new ConsentError(
        'No display name set for current user'
      )
    } else {
      return state.user.display_name
    }
  }

  /**
   * Get the user's password synchronously
   * @returns {string} password The user's password
   */
  static getPasswordSync() {
    const state = Session.getState()
    if (!state || !state.user || !state.user.password) {

      console.log("PASSWORD ERROR: -----------------------> ", state.user, " | ", state.user.password)

      throw new ConsentError(
        'No password set, user is not logged in',
        E_MUST_BE_LOGGED_IN
      )
    } else {
      return state.user.password
    }
  }

  /**
   * Set the DID of the user
   * @param {string} did The did to assigned to the user
   * @returns {string} did The did assigned to the user
   */
  static setDid(did) {
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (itemJSON) {
        try {
          // Update session
          Session.update(Object.assign(Session.getState().user, { did }))
          const user = JSON.parse(itemJSON)
          const userUpdate = Object.assign(user, { did })
          return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userUpdate))
        } catch (error) {
          return Promise.reject(
            new ConsentError(
              `Could not set did for ${STORAGE_KEY}`,
              E_COULD_NOT_SET_ITEM
            )
          )
        }

      } else {
        // create first record
        return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ did }))
      }
    })
    .then(error => {
      if (error) {
        return Promise.reject(
          new ConsentError(
            'Could not set item',
            E_COULD_NOT_SET_ITEM
          )
        )
      } else {
        return Promise.resolve(did)
      }
    })
  }

  /**
   * Get the ID of the user
   * @returns {string} id The Id of the user
   */
  static getIdSync() {
    const state = Session.getState()
    if (!state || !state.user || !state.user.id) {
      return null
    } else {
      return state.user.id
    }
  }

  /**
   * Get the DID of the user
   * @returns {string} did The DID of the user
   */
  static getDidSync() {
    const state = Session.getState()
    if (!state || !state.user || !state.user.did) {
      return null
    } else {
      return state.user.did
    }
  }

  static unregister() {
    let firebaseToken
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      const user = JSON.parse(itemJSON)
      if (user) {
        // Preserve firebase token
        firebaseToken = user.firebaseToken
        if (user.did) {
          return Api.unregister({ did: user.did })
        } else if (user.email) {
          return Api.unregister({ email: encodeURI(user.email) })
        } else {
          return Promise.reject(
            new ConsentError(
              `Nothing to unregister ${user.did} by`,
              E_NOTHING_TO_DELETE_BY
            )
          )
        }
      } else {
        return Promise.reject(
          new ConsentError(
            `Nothing to delete`,
            E_NOTHING_TO_DELETE
          )
        )
      }
    })
    .then(responseJson => {
      return Promise.all([
        Crypto.deleteKeyStore(Config.keystore.name),
        AsyncStorage.multiRemove([
          STORAGE_KEY,
          ConsentConnection.storageKey,
          ConsentConnectionRequest.storageKey,
          ConsentDiscoveredUser.storageKey
        ])
      ])
    })
    .then(results => {
      if (results[1]) {
        if (results[1].error) {
          Logger.error('Could not purge databases', LOGTAG, results[1].error)
          return Promise.reject('Could not purge databases')
        }
      } else {
        return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          user: { firebaseToken: firebaseToken }
        }))
      }
    })
  }

  static register(username, email, password) {

    let publicKeyPem, firebaseToken, toSign, userID
    Logger.info(`Registering as: ${username}, ${email}, ${password}`, LOGTAG)

    return ConsentUser.getToken()
    .then(_firebaseToken => {
      if (_firebaseToken) {
        Logger.info('Fetching secure random', LOGTAG)
        firebaseToken = _firebaseToken
        return Crypto.getKeyStoreList()
      } else {
        Logger.firebase('No firebase token available', LOGTAG)
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
        Logger.info('Creating new keystore', LOGTAG)
        return Crypto.createKeyStore(Config.keystore.name, password)
      }
    })

    // Create the user's keypair
    .then(() => {
      Logger.info('Creating keypair', LOGTAG)
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
      Logger.info('Converting public key to PEM format', LOGTAG)
      return Crypto.getKeyAsPem(Config.keystore.publicKeyName, password)
    })

    // Get firebase token
    .then(_publicKeyPem => {
      publicKeyPem = _publicKeyPem
      Logger.info('Fetching secure random', LOGTAG)
      return Crypto.secureRandom()
    })

    // Sign with private key
    .then(_secureRandom => {
      Logger.info('Signing...', LOGTAG)
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
      Logger.info('Sending details to server', LOGTAG)
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
        Logger.info('Registration on server failed', LOGTAG)
        Logger.info('Deleting keystore', LOGTAG)
        return Crypto.deleteKeyStore(Config.keystore.name)
        .then(() => {
          return Promise.reject(response.error)
        })
      }
      const jsonData = response.body
      // TODO: check server response
      // user could already exist etc
      Logger.info('Server responded', LOGTAG)
      userID = jsonData.id

      // See what's currently in the DB
      return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        id: userID,
        did: null, // will receive via firebase later
        display_name: username,
        email: email,
        firebaseToken: firebaseToken,
        registered: true  // We will get this later
      }))
    })
    .then( _ => {
      // Update state
        const sessionUpdate = {
          user: {
            id: userID,
            did: null,
            display_name: username,
            password: password,
            email: email,
            registered: true,
            loggedIn: true
          }
        }
        Session.update(sessionUpdate)
        Logger.info('User registered', LOGTAG)
        return Promise.resolve({
          id: userID
        })
    })

    // Check that writing went well and resolve
    .catch(error => {
      if (error) {
        // If we couldn't write to database
        Logger.error('Could not write to AsyncStorage', LOGTAG, error)
        return Promise.reject(error)
      } else {
        // Update state
        const sessionUpdate = {
          user: {
            id: userID,
            did: null,
            display_name: username,
            password: password,
            email: email,
            registered: true,
            loggedIn: true
          }
        }
        Session.update(sessionUpdate)
        Logger.info('User registered', LOGTAG)
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
    return AsyncStorage.getItem(STORAGE_KEY)
    .then(itemJSON => {
      if (!itemJSON) {
        return Promise.resolve(false)
      } else {
        const consentUser = JSON.parse(itemJSON)
        if (!consentUser || !consentUser.email || !consentUser.did) {
          return Promise.resolve(false)
        } else {
          return Promise.resolve(true)
        }
      }

    })
  }

  static async refreshThanksBalance() {
    return Api.thanksBalance().then(function(res) {
      if (res.error) {
        console.log('thanks balance error', res.status, res.message)
        return 
      }
      return res.body.balance
    }).catch(function(err) {
      console.log('Thanks balance error', err)
    })
  }
}
