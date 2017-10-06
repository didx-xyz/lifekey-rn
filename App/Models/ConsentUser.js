/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import {Platform, AsyncStorage} from 'react-native'
import Session from '../Session'
import Crypto from '../Crypto'
import Logger from '../Logger'
import Config from '../Config'
import Api from '../Api'
import Common from "../Common"
import ConsentConnection from './ConsentConnection'
import ConsentConnectionRequest from './ConsentConnectionRequest'
import ConsentDiscoveredUser from './ConsentDiscoveredUser'
import ConsentError from '../ConsentError'
import Firebase from 'react-native-firebase'

import Anonymous from "../Images/anonymous_person"

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
  static state = {}

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
        return Crypto.loadKeyStore()

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
    .then(_ => {
      // Unlocked keystore with password
      Logger.info('Keystore loaded, password verified', LOGTAG)
      // Check if user exists on the other side
      return Api.profile({did: user.did})
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
        ConsentUser.getPasswordSync()
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
    if(!state || !state.user || !state.user.display_name) {
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

  static register(newuser, fingerprint) {

    const {username, email} = newuser
    const password = newuser.pin

    console.log('attempting to register with fingerprint key?', fingerprint)

    let publicKeyPem1, publicKeyPem2, firebaseToken, toSign, userID
    Logger.info(`Registering as: ${username}, ${email}, ${password}`, LOGTAG)

    return ConsentUser.getToken(
    ).then(token => {
      if (token) {
        console.log('got firebase token, generating keypair(s)')
        firebaseToken = token
        return Crypto.loadKeyStore()
      } else {
        return Promise.reject('No token available. Cannot register')
      }
    }).then(_ => {
      return Promise.all([
        Crypto.addKeyPair(
          Config.keystore.keyName,
          Config.keystore.pemCertificatePath
        ),
        fingerprint ? Crypto.addKeyPair(
          Config.keystore.keyName + 'fingerprint',
          Config.keystore.pemCertificatePath
        ) : null
      ])
    }).then(pem_keys => {
      publicKeyPem1 = pem_keys[0].publicKeyPem
      publicKeyPem2 = fingerprint && pem_keys[1].publicKeyPem
      console.log('Fetching secure random(s)')
      return Promise.all([
        Crypto.secureRandom(),
        fingerprint ? Crypto.secureRandom() : null
      ])
    }).then(randoms => {
      console.log('Signing secure random(s)')
      return Promise.all([
        randoms[0],
        randoms[1],
        Crypto.sign(
          randoms[0],
          Config.keystore.privateKeyName
        ),
        fingerprint ? Crypto.sign(
          randoms[1],
          Config.keystore.privateKeyName + 'fingerprint'
        ) : null
      ])
    }).then(signature_data => {
      console.log('submitting registration data')
      return Api.register({
        email: email.trim(),
        nickname: username.trim(),
        device_id: firebaseToken,
        device_platform: Platform.OS,
        public_key_algorithm: Config.keystore.publicKeyAlgorithm,
        public_key: publicKeyPem1,
        plaintext_proof: signature_data[0],
        signed_proof: signature_data[2],
        fingerprint: fingerprint ? {
          plaintext_proof: signature_data[1],
          signed_proof: signature_data[3],
          public_key: publicKeyPem2,
          public_key_algorithm: 'rsa'
        } : null
      })
    }).then(response => {
      if (response.error === true) {
        // Server rejected registration
        // Remove keystore
        console.log('registration with server failed')
        return Promise.reject()
      }
      var jsonData = response.body
      userID = jsonData.id

      // See what's currently in the DB
      return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        id: userID,
        did: null,
        display_name: username,
        email: email,
        firebaseToken: firebaseToken,
        registered: true
      }))
    }).then(_ => {
      return AsyncStorage.setItem(
        STORAGE_KEY + '-password',
        JSON.stringify(password)
      )
    }).then(_ => {
      Session.update({
        user: {
          id: userID,
          did: null,
          display_name: username,
          password: password,
          email: email,
          registered: true,
          loggedIn: true
        }
      })
      console.log('registration complete')
      return Promise.resolve({id: userID})
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

  // * USER DATA AND PROFILE * //

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

  static clearCached(key) {
    delete this.state[key]
  }

  static getCached(key) {

    if (this.state[key] && this.state[key].time >= Date.now()) {
      return this.state[key].data
    }

    return null
  }

  static setCached(key, value, time = 300000 /* 5 minutes in milliseconds */) {

    const currentTime = new Date()
    this.state[key] = {
      "time": currentTime.setMilliseconds(currentTime.getMilliseconds() + time),
      "data": value
    }
  }

  static updateState(resource) {

    console.log("Hit UPDATE STATE")

    let myData = {...this.state.myData.data}

    myData.resourcesByType.forEach(rt => {
      
      const match = !!resource.schema ? Common.schemaCheck(resource.schema, rt.url) : `${rt.url}_form` === resource.form
      const existing = rt.items.some(item => item.id === resource.id)
      const resourceTypeIsVerifiableClaim = rt.name === 'Verifiable Claims'

      if((resourceTypeIsVerifiableClaim && resource.is_verifiable_claim) || match){
        existing ? (rt.items = rt.items.map(item => item.id === resource.id ? resource : item)) : rt.items.push(resource)

        if(resource.is_verifiable_claim){
          console.log("BEFORE BADGE ADD, RT NAME: ", rt.name)
          this.updateBadges(resource, myData)        
        }

        // const newBadge = this.determineBadge(resource)
        // console.log("NEW BADGE: ", newBadge)
        // console.log("BADGE COLLECTION LENGTH: ", myData.badges.length)

        // const badgeTypeExists = (!!newBadge && myData.badges.some(b => b.name === newBadge.name))

        // if(!!newBadge){
        //   myData.badges.push(newBadge)
        // }

      }
    })

    this.setCached("myData", myData, 300000)

  }

  static updateBadges(resource, myData){

    if(myData.badges.some(b => b.id === resource.id))
      return

    console.log("Hit UPDATE BADGES")

    const newBadge = this.determineBadge(resource)
    if(!!newBadge){
      myData.badges.push(newBadge)
    }

  }

  static updateProfile(profile) {
    
    console.log("NEW PROFILE: ", profile)
    if(profile.image_uri){
      profile.image_uri = Common.ensureDataUrlIsCleanOfContext(profile.image_uri)
      profile.image_uri = `data:image/jpg;base64,${profile.image_uri}`
    }
    else{
      profile.image_uri = Anonymous.uri
    }
    console.log("UPDATED PROFILE: ", profile)
    
    ConsentUser.setCached('profile', profile, 300000)
  }

  static removeFromState(id) {

    let myData = {...this.state.myData.data}
    myData.resourcesByType.forEach(rt => rt.items = rt.items.filter(item => item.id !== id))
    this.setCached("myData", myData, 300000)

  }

  static setPendingState(id, pendingState){

    let myData = {...this.state.myData.data}
    myData.resourcesByType.forEach(rt => rt.items = rt.items.map(item => { 
      if(item.id === id){
        item.pending = pendingState
      }
      return item
    }))
    this.setCached("myData", myData, 300000)
  }

  static cacheMyData(resources, profile){

    let resourceTypes = [...this.state.allResourceTypes.data]

    resources = this.verifyAndFixSchemaProperty(resources)
    const badges = this.sortBadges(resources)
    let myData = this.sortMyData(resources, resourceTypes, profile)

    myData.badges = badges
    myData.valid = true

    this.setCached("myData", myData, 300000)
  }

  static flattenCachedResources(arr) {
    if (Array.isArray(arr)) {
      return arr.reduce(function(done, curr) {
        return done.concat(ConsentUser.flattenCachedResources(curr))
      }, [])
    } else {
      return arr
    }
  }

  static verifyAndFixSchemaProperty(resources){
    resources.forEach(resource => {  
      resource.schema = Common.ensureUrlHasProtocol(resource.schema)
      if(!resource.form){
        resource.form = `${resource.schema}_form`
      }
    })

    return resources
  }

  static sortBadges(resources){

    console.log("SORT BADGES:", resources )

    var badges = Object.values(resources).map((v, i) => {
      return this.determineBadge(v)
    })
    .filter(v => !!v)

    return badges
  }

  static determineBadge(resource){

    //NEW

    if(!resource.claim || !resource.claim.isCredential || !resource.schema){
      return null
    }

    let badge = { id: resource.id }

    if (resource.schema === "http://schema.cnsnt.io/pirate_name") {
        badge.name = "Pirate Name"
        badge.image = require('../../App/Images/pirate_name.png')
    } else if (resource.schema === "http://schema.cnsnt.io/verified_identity") {
        badge.name = "Verified Identity"
        badge.image = require('../../App/Images/verified_identity.png')
    } else if (resource.schema === "http://schema.cnsnt.io/full_name") {
        badge.name = "Full Name"
        badge.image = require('../../App/Images/full_name.png')
    } else if (resource.schema === "http://schema.cnsnt.io/contact_email") {
        badge.name = "Verified Email"
        badge.image = require('../../App/Images/contact_email.png')
    } else if (resource.schema === "http://schema.cnsnt.io/contact_mobile") {
        badge.name = "Verified Mobile"
        badge.image = require('../../App/Images/contact_mobile.png')
    } else if(resource.schema === "http://schema.cnsnt.io/verified_face_match"){
        badge.name = "Verified FaceMatch"
        badge.image = require('../../App/Images/verified_face_match.png')
    } else {
      badge = null
    }

    return badge
  }

  // static determineBadge(v){

  //   const check = v.schema ? v.schema : v.form

  //   //NEW

  //   if(!v.claim || !v.claim.isCredential || !v.schema){
  //     return null
  //   }

  //   if (check === "http://schema.cnsnt.io/pirate_name") {
  //     return {
  //       "name": "Pirate Name",
  //       "description": "Hello ",
  //       "image": require('../../App/Images/pirate_name.png')
  //     }
  //   } else if (check === "http://schema.cnsnt.io/verified_identity") {
  //     return {
  //       "name": "Verified Identity",
  //       "description": "Hello ",
  //       "image": require('../../App/Images/verified_identity.png')
  //     }
  //   } else if (check === "http://schema.cnsnt.io/full_name") {
  //     return {
  //       "name": "Full Name",
  //       "description": "Hello ",
  //       "image": require('../../App/Images/full_name.png')
  //     }
  //   } else if (check === "http://schema.cnsnt.io/contact_email") {
  //     return {
  //       "name": "Verified Email",
  //       "description": "Hello ",
  //       "image": require('../../App/Images/contact_email.png')
  //     }
  //   } else if (check === "http://schema.cnsnt.io/contact_mobile") {
  //     return {
  //       "name": "Verified Mobile",
  //       "description": "Hello ",
  //       "image": require('../../App/Images/contact_mobile.png')
  //     }
  //   } else if(check === "http://schema.cnsnt.io/verified_face_match"){
  //     return {
  //       "name": "Verified FaceMatch",
  //       "description": "Hello ",
  //       "image": require('../../App/Images/verified_face_match.png')
  //     }
  //   } else {
  //     // FIXME
  //     console.log("HIT HERE 1: ", v)
  //     return null
  //   }
  // }

  static sortMyData(resources, resourceTypes, profile) {


    // Add logically seperate resources types that aren't persisted in server 
    resourceTypes.push({ name: 'Malformed', url: null, items: [] })
    resourceTypes.push({ name: 'Verifiable Claims', url: null, items: [] })
    resourceTypes.push({ name: 'Decentralized Identifier', url: 'http://schema.cnsnt.io/decentralised_identifier', items: [] })
    resourceTypes.push({ name: 'Miscellaneous', url: null, items: [] })

    /* Experimental - note the items property is an object */
    // resourceTypes.push({ name: 'ConnectionData', url: null, items: {} }) 

    // Sort known items and verifiable claims  
    resourceTypes.map(rt => {

      if(rt.name === 'Verifiable Claims'){
        rt.items = resources.filter(r => r.is_verifiable_claim)
      }
      else{
        rt.items = resources.filter(r => {

          if(r.is_verifiable_claim || r.from_user_did){
            return false
          }

          if(!!r.schema){
            return Common.schemaCheck(r.schema, rt.url)
          }
          else{
            return `${rt.url}_form` === r.form
          }
        })
      }
      
      return rt
    })

    // Sort miscellaneous resources 
    let misc = resourceTypes.find(rt => rt.name === 'Miscellaneous')
    misc.items = resources.filter(r => !resourceTypes.some(rt => Common.schemaCheck(r.schema, rt.url)))

    // Set profile pic
    const person = resourceTypes.find(rt => rt.url === "http://schema.cnsnt.io/person").items[0]
    const identityPhotographUri = person && person.identityPhotograph ? `data:image/jpg;base64,${person.identityPhotograph}` : Anonymous.uri

    return { resourcesByType: resourceTypes, profilePicUrl: identityPhotographUri }

  }

  static cacheMyConnection(myConnections){

    const sortedPeerConnections = this.sortConnectionData(myConnections.peerConnections)

    const newAllConnections = Object.assign({}, myConnections, { "peerConnections": sortedPeerConnections })
    this.setCached("myConnections", newAllConnections, 300000)
  }

  static sortConnectionData(peerConnections){

    /* This should organise resources under resource types and store them under connections */
    const resources = this.getCached("allResources")
    const resourceTypes = this.getCached("allResourceTypes")

    if(!peerConnections) return

    peerConnections.forEach(connection => { 
      
      /* Really important to ensure that original resourceTypes remain unmutated */
      let shallowResourceTypes = [ ...resourceTypes.map(rt => Object.assign({}, rt)) ]
      let connectionResources = resources.filter(r => !!r.from_user_did && r.from_user_did === connection.did)

      shallowResourceTypes.forEach(rt => {
        
        rt.items = connectionResources.filter(r => Common.schemaCheck(r.schema, rt.url) || `${rt.url}_form` === r.form) 

        /* Order important */
        if(rt.name === "Public Profile"){
          rt.items = [ Object.assign({}, connection) ]
        }

      })

      console.log("GOT HERE: 1")

      connection.resourcesByType = shallowResourceTypes

    })

    return peerConnections

  }

  static updateConnectionState(resource) {

    const allConnections = this.getCached("myConnections")

    if(!allConnections) return

    let connection = allConnections.peerConnections.find(c => c.did === resource.from_user_did)

    console.log("GOT HERE: 1", connection)

    connection.resourcesByType.forEach(rt => {
      
      const match = !!resource.schema ? Common.schemaCheck(resource.schema, rt.url) : `${rt.url}_form` === resource.form
      const existing = rt.items.some(item => item.id === resource.id)
      const resourceTypeIsVerifiableClaim = rt.name === 'Verifiable Claims'

      if((resourceTypeIsVerifiableClaim && resource.is_verifiable_claim) || match){
        existing ? (rt.items = rt.items.map(item => item.id === resource.id ? resource : item)) : rt.items.push(resource)
      }
    })

    const newAllConnections = Object.assign({}, allConnections, 
                                            { "peerConnections": allConnections.peerConnections
                                                                               .map(pc => { 
                                                                                     return pc.did === resource.from_user_did ? connection : pc 
                                                                                  }) 
                                                                               })

    this.setCached("myConnections", newAllConnections, 300000)

  }

  static addNewEnabledPeerConnection(connectionProfile){

    console.log("CONNECTION ENABLED PROFILE: ", connectionProfile)

    const connections = this.getCached("myConnections")
    const newConnections = Object.assign({}, connections, { peerConnections: [ ...connections.peerConnections, connectionProfile ]})
    this.setCached("myConnections", newConnections, 300000)

  }

  static addNewPendingPeerConnection(connectionProfile){

    console.log("CONNECTION PENDING PROFILE: ", connectionProfile)

    const connections = this.getCached("myConnections")
    const newConnections = Object.assign({}, connections, { pendingPeerConnections: [ ...connections.pendingPeerConnections, connectionProfile ]})
    this.setCached("myConnections", newConnections, 300000)

  }

  static removeEnabledPeerConnection(removeUserConnectionId){

    const connections = this.getCached("myConnections")
    const newConnections = Object.assign({}, connections, 
                                         { peerConnections: connections.peerConnections
                                                                       .filter(c => c.user_connection_id !== removeUserConnectionId) })
    this.setCached("myConnections", newConnections, 300000)

  }

  static removePendingPeerConnection(connectionProfile){

    const connections = this.getCached("myConnections")
    const newConnections = Object.assign({}, connections, 
                                         { pendingPeerConnections: connections.pendingPeerConnections
                                                                       .filter(c => c.did !== connectionProfile.did) })
    this.setCached("myConnections", newConnections, 300000)

  }

  static addNewEnabledBotConnection(connectionProfile){

    console.log("CONNECTION BOT PROFILE: ", connectionProfile)

    const connections = this.getCached("myConnections")
    const newConnections = Object.assign({}, connections, { botConnections: [ ...connections.botConnections, connectionProfile ]})
    this.setCached("myConnections", newConnections, 300000)

  }

  static removePendingBotConnection(connectionProfile){

    const connections = this.getCached("myConnections")
    const newConnections = Object.assign({}, connections, 
                                         { pendingBotConnections: connections.pendingBotConnections
                                                                             .filter(c => c.did !== connectionProfile.did) })
    this.setCached("myConnections", newConnections, 300000)

  }

  

  

  // * END USER DATA AND PROFILE * //

  // * USER CONNECTIONS * //


    


  // * END USER CONNECTIONS * //
}
