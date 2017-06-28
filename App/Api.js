// internal dependencies
import Config from "./Config"
import Crypto from "./Crypto"
import Session from "./Session"
import Logger from "./Logger"
import Common from "./Common"
import ConsentUser from "./Models/ConsentUser"
import ConsentError, { ErrorCode } from "./ConsentError"
import { request, rejectionWithError } from "./Requests"

function getMissingFieldsMessage(missingFields) {
  return "Missing required fields. Required fields: " + JSON.stringify(missingFields)
}

function checkParameters(requiredKeys, receivedObject) {
  // It must be an object
  if (typeof receivedObject !== 'object') {
    throw new Error(
      `Expected 'object', received '${typeof receivedObject}'`
    )
  }
  
  var missing = false
  var missing_key
  requiredKeys.forEach(key => {
    if (!(key in receivedObject && receivedObject[key])) {
      missing_key = key
      missing = true
    }
  })

  if (missing) throw new Error(missing_key + ' cannot be falsy')
}

// const state = {}

export default class Api {

  /*
   * Register a user
   * 0 POST /management/user
   */
  static register(data) {
    checkParameters([
      'email',
      'nickname',
      'device_id',
      'device_platform',
      'public_key_algorithm',
      'public_key',
      'plaintext_proof',
      'signed_proof'
    ], data)
    return request('/management/register', {
      body: JSON.stringify(data),
      method: 'POST'
    }, false)
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
  static requestConnection(data, fingerprint = false) {
    const requiredFields = [
      'target'
    ]
    if (checkParameters(requiredFields, data)) {
      return request('/management/connection', {
        body: JSON.stringify({target: data.target}),
        method: 'POST'
      }, true, fingerprint)
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
  static respondConnectionRequest(data, fingerprint = false) {
    const requiredFields = [
      'user_connection_request_id',
      'accepted' // true/false (in body)
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/connection/${data.user_connection_request_id}`, {
        body: JSON.stringify({ accepted: data.accepted }),
        method: 'POST'
      }, true, fingerprint)
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }
  
  // Delete a connection /management/connection/:user_connection_id
  static deleteConnection(data, fingerprint = false) {
    const requiredFields = [
      'user_connection_id'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/connection/${data.user_connection_id}`, {
        method: 'DELETE'
      }, true, fingerprint)
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // Request an ISA
  static requestISA(data, fingerprint = false) {
    const requiredFields = [
      'to',
      'requested_schemas',
      'purpose',
      'license'
    ]
    if (checkParameters(requiredFields, data)) {
      return request('/management/isa', {
        method: 'POST'
      }, true, fingerprint)
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // Respond to an ISA request
  static respondISA(data, fingerprint = false) {
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
      }, true, fingerprint)
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
  static deleteISA(data, fingerprint = false) {
    const requiredFields = [
      'isa_id'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/isa/${data.isa_id}`, {
        method: 'DELETE'
      }, true, fingerprint)
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
  static updateISA(data, fingerprint = false) {
    const requiredFields = [
      'isa_id',
      'permitted_resources'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/isa/${data.isa_id}`, {
        method: 'PUT',
        body: JSON.stringify(data.permitted_resources)
      }, true, fingerprint)
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
  static pushISA(data, fingerprint = false) {
    const requiredFields = [
      'isa_id',
      'resources'
    ]
    if (checkParameters(requiredFields, data)) {
      return request(`/management/push/${data.isa_id}`, {
        method: 'POST',
        body: JSON.stringify({resources: data.resources})
      }, true, fingerprint)
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }

  // ##################
  // #### RESOURCE ####
  // ##################

  
  static getMyData(milliseconds = 300000){
    let cached = ConsentUser.getCached("myData")
    
    if (cached && cached.valid) {
      return Promise.resolve(cached)
    }
    
    return Promise.all([
      this.allResourceTypes(),
      this.allResources()
    ]).then(values => {
      

      const updatedResources = values[1].body.map(resource => {
        return {
          id: resource.id,
          alias: resource.alias,
          schema: resource.schema, 
          is_verifiable_claim: resource.is_verifiable_claim,
          ...JSON.parse(resource.value)
        }
      })

      ConsentUser.cacheMyData(updatedResources)

      return ConsentUser.getCached("myData")

    }).catch(error => {
      Logger.error(error)
    })
  }

  static getFlattenedResources(){
    
    return this.getMyData().then(data => {

      let arrayOfResourceArrays = data.resourcesByType.map(rt => rt.items)
      let flattenedResources = ConsentUser.flattenCachedResources(arrayOfResourceArrays)
      return flattenedResources 

    }).catch(error => {
      Logger.error(error)
    })
  }

  static allResourceTypes(milliseconds = 300000) {

    let cached = ConsentUser.getCached("allResourceTypes")
    
    if (cached !== null) {
      return Promise.resolve(cached)
    }

    return request("http://schema.cnsnt.io/resources").then(data => {
      ConsentUser.setCached("allResourceTypes", data.resources, milliseconds)
    }) 
  }

  static getResourceForm(form, milliseconds = 600000) {

    form = Common.ensureUrlHasProtocol(form)
    const formComponents = form.split('/')
    const formName = formComponents[formComponents.length - 1]

    let cached = ConsentUser.getCached(formName)
    
    if (cached !== null) {
      return Promise.resolve(cached)
    }

    return request(form).then(data => {
      ConsentUser.setCached(formName, data, milliseconds)
      return data
    })    
    
  }

  // 0 GET /resource
  static allResources(milliseconds = 300000) {

    return request("/resource?all=1")

  }

  // 1 GET /resource/:resource_id
  static getResource(data) {
    const requiredFields = [
      'id'
    ]

    if (checkParameters(requiredFields, data)) {

      // Try fetch from cache first 
      let cached = ConsentUser.getCached("myData")
      let resource

      if (cached) {

        const containerResourceType = cached.resourcesByType.find(rt => rt.items.some((item) => item.id === data.id))
        if(containerResourceType){
          resource = containerResourceType.items.find(item => item.id === data.id)
        }
      }

      if(cached && resource){
        return Promise.resolve(resource)
      }
      
      // else
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
      'value',
      'schema'
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

  // 12 GET /profile
  static myProfile() {

    return request('/profile', {
      method: 'GET'
    })
  }

  // 14 POST /facial-verfication token
  // Get a Face pic after scanning a QR code
  static facialVerificationQrScanResponse(user_did, token) {
    return request(`/facial-verification/${user_did}/${token}`, {
      method: 'GET'
    }, false) // TODO try and make this request authenticated
  }

  // 15 POST /facial-verfication
  // User result on QR code verification
  static facialVerificationResult(user_did, token, result, fingerprint = false) {
    return request(`/facial-verification/${user_did}/${token}`, {
      method: 'POST',
      body: JSON.stringify({result : result})
    }, true, fingerprint)
  }

  // 16 GET /management/thanks/balance
  static thanksBalance() {
    return request('/management/thanks/balance')
  }

  // 17 POST /management/isa/:user_did/:action_name
  /**
   * @param {*} with_user_did the did of the user with whom you want to establish an ISA
   * @param {*} action_name the name of the action stored by the user with whom you want to establish an ISA
   * @param {*} permitted_resources either an array of objects with integer id properties or an array of integer id values
   */
  static establishISA(with_user_did, action_name, permitted_resources, fingerprint = false) {
    if (Array.isArray(permitted_resources)) {
      if (permitted_resources[0].id) {
        permitted_resources = permitted_resources.map(pr => pr.id)
      }
    }
    return request(`/management/isa/${with_user_did}/${action_name}`, {
      method: 'POST',
      body: JSON.stringify({
        entities: permitted_resources
      }, true, fingerprint)
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
      const route = data.id ? (
        `/debug/unregister/?user_id=${data.id}`
      ) : (
        `/debug/unregister/?email=${data.email}`
      )
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
