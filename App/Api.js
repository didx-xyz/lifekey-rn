// internal dependencies
import Config from "./Config"
import Crypto from "./Crypto"
import Session from "./Session"
import Logger from "./Logger"
import ConsentUser from "./Models/ConsentUser"
import ConsentError, { ErrorCode } from "./ConsentError"
import { request, rejectionWithError } from "./Requests"

function getMissingFieldsMessage(missingFields) {
  return "Missing required fields. Required fields: " + JSON.stringify(missingFields)
}

function checkParameters(requiredKeys, receivedObject) {
  // It must be an object
  if (typeof receivedObject !== 'object') {

    throw new Error(`Expected 'object', received '${typeof receivedObject}'`)
  }

  // Get the keys of the parameter object and sort them
  const receivedObjectKeys = Object.keys(receivedObject)

  // Maybe we can save CPU cycles (before we crash... )
  if (receivedObjectKeys.length !== requiredKeys.length) {

    const errorMessage = 'Expected an object containing the keys:\n'
                        + requiredKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)
                        + '\nbut recieved an object containing:\n'
                        + receivedObjectKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)

    throw new Error(errorMessage)
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
      throw new Error(errorMessage)
    }

    // null is not allowed
    if (receivedObject[requiredKeys[i]] === null || typeof receivedObject[requiredKeys[i]] === 'undefined') {
      throw new Error(`${receivedObject[requiredKeys[i]]} cannot be 'null' or 'undefined'`)
    }
  }

  // We're good to go
  return true

}

export default class Api {

  /*
   * Register a user
   * 0 POST /management/user
   */
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

  /*
   * Report device info
   * 1 POST /management/device
   */
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

  /*
   * Make a connection request with a target
   * 2 POST /management/connection
   */
  static requestConnection(data) {
    const requiredFields = [
      'target'
    ]
    if (checkParameters(requiredFields, data)) {
      const userDID = Session.getState().user.did
      return request('/management/connection', {
        body: JSON.stringify({ target: data.target, from_did: userDID }),
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
      'isa_id',
      'accepted',
      'permitted_resources'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/isa/${data.isa_id}`, {
        method: 'POST',
        body: JSON.stringify({
          accepted: data.accepted,
          permitted_resources: data.permitted_resources
        })
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
      'user_did'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/qr/${data.user_did}`, {
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

  static allResourceTypes() {
    return request("http://schema.cnsnt.io/resources")
  }

  static getResourceForm(form) {
    return request(form)
  }

  // 0 GET /resource
  static allResources() {
    return request("/resource?all=1")
  }

  // 1 GET /resource/:resource_id
  static getResource(data) {
    const requiredFields = [
      'id'
    ]

    if (checkParameters(requiredFields, data)) {
      return request(`/resource/${data.id}`)
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 2 POST /resource
  static createResource(data) {
    const requiredFields = [
      'entity',
      'attribute',
      'alias',
      'value'
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

  // 3 PUT /resource/:resource_id
  static updateResource(data) {
    return request(`/resource/${data.id}`,{
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // 4 DELETE /resource/:resource_id
  static deleteResource(data) {
    const requiredFields = [
      'id'
    ]

    if (checkParameters(requiredFields, data)) {
      return request(`/resource/${data.id}`, {
        method: 'DELETE'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 5 GET /profile/:did
  static profile(data) {
    const requiredFields = [
      'did'
    ]

    if (checkParameters(requiredFields, data)) {
      return request(`/profile/${data.did}`, {
        method: 'GET'
      }, false)
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 6 PUT /profile/colour
  static profileColour(data) {
    const requiredFields = [
      'colour'
    ]

    if (checkParameters(requiredFields, data)) {
      return request('/profile/colour', {
        method: 'PUT'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 7 PUT /profile/image
  static profileImage(data) {
    const requiredFields = [
      'image_uri'
    ]

    if (checkParameters(requiredFields, data)) {
      return request('profile/image', {
        method: 'PUT'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 8 PUT /profile/name
  static profileName(data) {
    const requiredFields = [
      'name'
    ]

    if (checkParameters(requiredFields, data)) {
      return request('profile/name', {
        method: 'PUT'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 9 PUT /profile/email
  static profileEmail(data) {
    const requiredFields = [
      'email'
    ]

    if (checkParameters(requiredFields, data)) {
      return request('profile/email', {
        method: 'PUT'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 10 PUT /profile/tel
  static profileTel(data) {
    const requiredFields = [
      'tel'
    ]

    if (checkParameters(requiredFields, data)) {
      return request('profile/tel', {
        method: 'PUT'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 11 PUT /profile/address
  static profileAddress(data) {
    const requiredFields = [
      'address'
    ]

    if (checkParameters(requiredFields, data)) {
      return request('profile/address', {
        method: 'PUT'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // 9 GET /profile
  static myProfile() {

    return request('/profile', {
      method: 'GET'
    })
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

  static getActiveBots() {
    return request('/directory', {
      method: 'GET'
    })
  }
}
