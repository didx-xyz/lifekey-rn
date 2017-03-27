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
    return ConsentKeystore.load(password)
    .then(name => {
      const update = {}[ConsentUser.storageKey] = {
        password: password,
        loggedIn: true
      }
      Session.update(update)
      return Promise.resolve()
    })
  }

  static logout() {
    // YOU CAN NEVER LEAVE CONSENT
    // Clear password from session
    // maybe unload keystore?
  }

  static setDid(did) {
    const update = {}[ConsentUser.storageKey] = { dbDid: did }
    return Storage.store(Config.storage.dbKey, update)
    .then(() => {
      Session.update(update)
      return Promise.resolve(did)
    })
  }

  static getToken() {
    return Firebase.getToken()
  }

  static register(username, email, password) {

    let publicKeyPem, firebaseToken, toSign
    Logger.info(`Registering as: ${username}, ${email}, ${password}`)

    // Check if already registered
    return Crypto.getKeyStoreList()
    .then(keystoreList => {
      const exists = keystoreList.find(x => x === Config.keystore.name)
      if (exists) {
        return Promise.reject(`The keystore ${Config.keystore.name} already exists`)
      } else {
        Logger.info('Creating new keystore')
        return Crypto.createKeyStore(Config.keyStoreName, password)
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
      const sessionUpdate = {}
      sessionUpdate[ConsentUser.storageKey] = {
        dbId: jsonData.id,
        password: password,
        email: email,
        registered: true
      }
      const storageUpdate = {}
      storageUpdate[ConsentUser.storageKey] = {
        dbId: jsonData.id,
        email: email,
        registered: true
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
    return Session.getState().user.password ? true : false
  }

  static isRegistered() {
    return new Promise((resolve, reject) => {
      const userState = Session.getState().user
      if (!userState || !userState.registered) {
        // storage
        Storage.load(Config.storage.dbKey)
        .then(data => {
          if (!data || !data.user) {
            // reject
            reject('Cannot determine user registration state')
          } else {
            resolve(data.user.registered ? true : false)
          }
        })
      } else {
        resolve(userState.registered)
      }
    })
  }
}
