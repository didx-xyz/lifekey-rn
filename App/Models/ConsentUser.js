/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import { Platform } from 'react-native'
import Session from '../Session'
import Storage from '../Storage'
import Crypto from '../Crypto'
import Firebase from '../Firebase'
import Logger from '../Logger'
import Config from '../Config'
import Api from '../Api'
import ConsentKeystore from './ConsentKeystore'

export default class ConsentUser {

  static storageKey = 'user'

  static get() {
    const userState = Session.getState()[ConsentUser.storageKey]
    if (userState) {
      return userState
    } else {
      // Initialise
      const update = {}[ConsentUser.storageKey] = {}
      Session.update(update)
      // It's empty
      return {}
    }
  }

  static login(password) {
    // load keys maybe?
    const update = {}[ConsentUser.storageKey] = {
      password: password,
      loggedIn: true
    }
    Session.update(update)
  }

  static logout() {
    // YOU CAN NEVER LEAVE CONSENT
  }

  static setDid(did) {
    const update = {}[ConsentUser.storageKey] = { dbDid: did }
    return Storage.store(Config.storage.dbKey, update)
    .then(() => {
      Session.update(update)
      return Promise.resolve(did)
    })
  }

  static register(username, email, password) {

    let publicKeyPem, firebaseToken, toSign

    // Check if already registered
    return ConsentUser.isRegistered()
    .then(registered => {
      if (registered) {
        return Promise.reject('Already registered')
      } else {
        // create keystore first
        return Crypto.createKeyStore(Config.keystore.name, password)
      }
    })

    // Create the user's keypair
    .then(() => Crypto.addKeyPair(
      Crypto.KEYPAIR_RSA,
      Config.keystore.keyName,
      2048,
      password,
      Config.keystore.pemCertificatePath
    ))

    // Get public key in PEM format
    .then(_keys => Crypto.getKeyAsPem(Config.keystore.publicKeyName, password))

    // Get firebase token
    .then(_publicKeyPem => {
      publicKeyPem = _publicKeyPem
      return Firebase.getToken()
    })
    .then(_firebaseToken => {
      firebaseToken = _firebaseToken
      return Crypto.secureRandom()
    })
    // Sign with private key
    .then(_secureRandom => {
      toSign = _secureRandom
      return Crypto.sign(
        toSign,
        Config.keystore.privateKeyName,
        password,
        Crypto.SIG_SHA256_WITH_RSA
      )
    })

    // Send to server
    .then(signature => Api.register({
      email: email,
      nickname: username,
      device_id: firebaseToken,
      device_platform: Platform.OS,
      public_key_algorithm: Config.keystore.publicKeyAlgorithm,
      public_key: publicKeyPem,
      plaintext_proof: toSign,
      signed_proof: signature
    }))

    // Get response from server
    .then(response => {
      const jsonData = response.body
      // Store in session and persistent storage
      const sessionUpdate = {}[ConsentUser.storageKey] = {
        dbId: jsonData.id,
        password: password,
        email: email
      }
      const storageUpdate = {}[ConsentUser.storageKey] = {
        dbId: jsonData.id,
        email: email
      }
      Session.update(sessionUpdate)
      return Storage.store(Config.storage.dbKey, storageUpdate)
    })
    .then(() => {
      Logger.info('User registered')
      return Promise.resolve()
    })
  }

  static isLoggedIn() {
    return Session.getState().user.loggedIn
  }

  static isRegistered() {
    return ConsentKeystore.exists()
    .then(exists => {
      if (exists) {
        Logger.info(`Keystore "${Config.keystore.name}" found. User is registered.`, this.filename)
        Session.update({ user: { registered: true } })
        return Promise.resolve(true)
      } else {
        Logger.info(`Keystore "${Config.keystore.name}" not found. User not registered.`, this.filename)
        Session.update({ user: { registered: false } })
        return Promise.resolve(false)
      }
    })
  }
}
