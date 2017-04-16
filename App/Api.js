/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Config from './Config'
import Crypto from './Crypto'
import Logger from './Logger'
import ConsentUser from './Models/ConsentUser'
import ConsentError, { ErrorCode } from './ConsentError'

function getMissingFieldsMessage(missingFields) {
  return 'Missing required fields. Required fields: ' + JSON.stringify(missingFields)
}

// Make an HTTP request
function request(route, opts, signedRequest = true) {

  if (signedRequest) {
    let userID, secureRandom, signature

    return ConsentUser.get()
    .then(results => {
      if (!results || !results.firebaseToken || !results.registered) {
        return Promise.reject('User not registered. Cannot send a signed request')
      } else {
        userID = results.id
        return Crypto.getKeyStoreIsLoaded()
      }
    })
    .then(keystoreLoaded => {
      if (keystoreLoaded) {
        return Crypto.secureRandom()
      } else {
        return Promise.reject(
          new ConsentError('Keystore must first be loaded', ErrorCode.E_ACCESS_KEYSTORE_NOT_LOADED)
        )
      }
    })
    .then(_secureRandom => {
      secureRandom = _secureRandom
      return Crypto.sign(
        secureRandom,
        Config.keystore.privateKeyName,
        ConsentUser.getPasswordSync(),
        Crypto.SIG_SHA256_WITH_RSA
      )
    })
    .then(_signature => {
      signature = _signature

      const options = Object.assign({
        method: 'GET',  // Default
        headers: {
          'content-type': 'application/json',
          'x-cnsnt-id': userID,
          'x-cnsnt-plain': secureRandom,
          'x-cnsnt-signed': signature
        }
      }, opts)
      Logger.networkRequest(
        options.method,
        new Date(),
        Config.http.baseUrl + route,
        opts
      )
      return fetch(Config.http.baseUrl + route, options)
    })
    .then(response => {
      Logger.networkResponse(response.status, new Date(), response._bodyText)

      switch (parseInt(response.status, 10)) {
      case 500:
        Logger.error('500 Internal server error', 'Api.js', response)
        return Promise.reject('Internal server error')
      case 400:
        return Promise.reject(JSON.parse(response._bodyText))
      case 502: // Bad gateway
        Logger.error('502 Bad gateway', 'Api.js', response)
        return Promise.reject(new ConsentError(
          '502 Bad Gateway from server'
        ))
      case 200: // Okay
        Logger.info('200 Okay', 'Api.js')
        return response.json()
      case 201:
        Logger.info('201 Created', 'Api.js')
        return response.json()
      default:
        return Promise.reject(JSON.stringify(response))
      }
    })

  } else {
    const options = Object.assign({
      method: 'GET',  // Default
      headers: {
        'content-type': 'application/json',
      }
    }, opts)
    Logger.networkRequest(options.method, new Date(), Config.http.baseUrl + route)
    console.log(opts)
    return fetch(Config.http.baseUrl + route, options)
    .then(response => {
      Logger.networkResponse(response.status, new Date(), response._bodyText)
      // TODO: check response code etc
      return response.json()
    })
    .then(json => {
      // TODO: check response body
      if (json.error) {
        return Promise.reject(json)
      } else {
        return Promise.resolve(json)
      }
    })
  }
}

function checkParameters(requiredKeys, receivedObject) {
  // It must be an object
  if (typeof receivedObject !== 'object') {

    throw new ConsentError(
      `Expected 'object', received '${typeof receivedObject}'`,
      ErrorCode.E_API_FATAL_ERROR
    )
  }

  // Get the keys of the parameter object and sort them
  const receivedObjectKeys = Object.keys(receivedObject)

  // Maybe we can save CPU cycles (before we crash... )
  if (receivedObjectKeys.length !== requiredKeys.length) {

    const errorMessage = 'Expected an object containing the keys:\n'
                        + requiredKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)
                        + '\nbut recieved an object containing:\n'
                        + receivedObjectKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)

    throw new ConsentError(errorMessage, ErrorCode.E_API_FATAL_ERROR)
  }

  // We need these sorted, now
  const recievedObjectKeysSorted = receivedObjectKeys.sort()
  const requiredKeysSorted = requiredKeys.sort()

  // kickn' it oldskool
  for (let i = 0; i < requiredKeys.length; i++) {

    // Compare one by one
    if (recievedObjectKeysSorted[i] !== requiredKeysSorted[i]) {
      const errorMessage = 'Expected an object containing the keys:\n'
                        + requiredKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)
                        + '\nbut recieved an object containing:\n'
                        + receivedObjectKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)
      throw new ConsentError(errorMessage, ErrorCode.E_API_ERROR)
    }

    // null is not allowed

    if (receivedObject[requiredKeys[i]] === null || typeof receivedObject[requiredKeys[i]] === 'undefined') {
      throw new ConsentError(`${receivedObject[requiredKeys[i]]} cannot be 'null' or 'undefined'`, ErrorCode.E_API_FATAL_ERROR)

    }
  }

  // We're good to go
  return true

}

export default class Api {


  // Fetch a profile
  static profile(data) {
    const requiredFields = [
      'did'
    ]
    checkParameters(requiredFields, data)
    return request(`/profile/${data.did}`, {
      method: 'GET'
    }, false)
  }

  // Register a user
  static register(data) {
    const requiredFields = [
      'email',
      'nickname',
      'device_id',
      'device_platform',
      'public_key_algorithm',
      'public_key',
      'plaintext_proof',
      'signed_proof'
    ]

    if (checkParameters(requiredFields, data)) {
      return request('/management/register', {
        body: JSON.stringify(data),
        method: 'POST'
      }, false)
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }

  }

  // Report device info
  static device(data) {
    const requiredFields = [
      'device_id',
      'device_platform'
    ]
    if (checkParameters(requiredFields, data)) {
      return request('/management/device', {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-cnsnt-id': data.user_id,
          'x-cnsnt-plain': data.plain,
          'x-cnsnt-signed': data.signature
        }
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Make a connection request with a target
  static requestConnection(data) {
    const requiredFields = [
      'target'
    ]
    if (checkParameters(requiredFields, data)) {
      return request('/management/connection', {
        body: JSON.stringify({ target: data.target }),
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Get all unacked and enabled connections
  static allConnections() {
    return request('/management/connection', {
      method: 'GET'
    })
  }

  // Accept a connection request
  static respondConnectionRequest(data) {
    const requiredFields = [
      'user_connection_request_id',
      'accepted' // true/false (in body)
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/connection/${data.user_connection_request_id}`, {
        body: JSON.stringify({ accepted: data.accepted }),
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Delete a connection /management/connection/:user_connection_id
  static deleteConnection(data) {
    const requiredFields = [
      'user_connection_id'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/connection/${data.user_connection_id}`, {
        method: 'DELETE'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Activate a newly created account
  static activate(data) {
    const requiredFields = [
      'activation_code'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/activation/${data.activation_code}`, {
        method: 'GET'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Request an ISA
  static requestISA(data) {
    const requiredFields = [
      'to',
      'requested_schemas',
      'purpose',
      'license'
    ]
    if (checkParameters(requiredFields, data)) {
      return request('/management/isa', {
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Respond to an ISA request
  static respondISA(data) {
    const requiredFields = [
      'accepted',
      'permitted_resources'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/isa/${data.isar_id}`, {
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Get all ISAs
  static allISAs() {
    return request('/management/isa', {
      method: 'GET'
    })
  }

   // Get an ISA by id
  static getISA(data) {
    const requiredFields = [
      'id'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/isa/${data.id}`, {
        method: 'GET'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Delete an ISA
  static deleteISA(data) {
    const requiredFields = [
      'isa_id'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/isa/${data.isa_id}`, {
        method: 'DELETE'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Demo QR code
  static qrCode(data) {
    const requiredFields = [
      'user_id'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/qr/${data.user_id}`, {
        method: 'GET'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Update an ISA by id
  static updateISA(data) {
    const requiredFields = [
      'isa_id',
      'permitted_resources'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/isa/${data.isa_id}`, {
        method: 'PUT',
        body: JSON.stringify(data.permitted_resources)
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Pull an ISA
  static pullISA(data) {
    const requiredFields = [
      'isa_id'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/pull/${data.isa_id}`, {
        method: 'GET'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

   // Pull an ISA
  static pushISA(data) {
    const requiredFields = [
      'isa_id',
      'resources'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/push/${data.isa_id}`, {
        method: 'POST',
        body: JSON.stringify({ resources: data.resources })
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // ##################
  // #### RESOURCE ####
  // ##################

  static resource(data) {
    const requiredFields = [
      'value',
      'entity',
      'attribute',
      'alias'
    ]

    if (checkParameters(requiredFields, data)) {
      return request('/resource', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // ##################
  // ##### DEBUG ######
  // ##################

   // Delete a user
  static unregister(data) {
    if (Config.DEBUG) {
      if (!data.id && !data.email) {
        return Promise.reject(`ID or email must be specified. id: ${data.id}, email: ${data.email}`)
      }
      const route = data.id ? `/debug/unregister/?user_id=${data.id}`
                                 : `/debug/unregister/?email=${data.email}`
      const options = {
        method: 'GET'
      }
      return request(route, options, false)
    } else {
      // fail silenty
    }
  }
}
