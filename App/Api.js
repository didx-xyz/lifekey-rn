/**
 * Early Childhood Development App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Config from './Config'

import Logger from './Logger'

function request(route, opts) {

  const options = Object.assign({
    method: 'GET',
    headers: { 'content-type': 'application/json' }
  }, opts)

  Logger.networkRequest(options.method, new Date(), Config.http.baseUrl + route)

  return fetch(Config.http.baseUrl + route, options)
  .then((response) => {
    if (Config.debug && Config.debugNetwork) {
      Logger.networkResponse(response.status, new Date(), response._bodyText)
    }
    return response.json()
  })
  .then((json) => {
    if (json.error) {
      return Promise.reject(json)
    } else {
      return Promise.resolve(json)
    }
  })
}

function containsRequired(requiredFields, data) {
  return (
    JSON.stringify(requiredFields.sort()) ===
    JSON.stringify(Object.keys(data).sort())
  )
}

function getMissingFieldsMessage(missingFields) {
  return 'Missing required fields. Required fields: ' . JSON.stringify(missingFields)
}

/** API functions avaialble to the App */
export default {

  /* 0 POST /management/register
   * Register a user
   */
  register: (data) => {
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

    if (containsRequired(requiredFields, data)) {
      return request('/management/register', {
        body: JSON.stringify(data),
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }

  },

  /* 1 POST /management/device
   * Report device info
   */
  device: (data) => {
    const requiredFields = [
      'device_id',
      'device_platform'
    ]
    if (containsRequired(requiredFields, data)) {
      return request('/management/device', {
        body: JSON.stringify(data),
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 2 POST /management/connection
   * Make a connection request with a target
   */
  requestConnection: (data) => {
    const requiredFields = [
      'target'
    ]
    if (containsRequired(requiredFields, data)) {
      return request('/management/connections', {
        body: JSON.stringify(data),
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 3 GET /management/connection
   * Get all unacked and enabled connections
  */
  allConnections: () => {
    return request('/management/connection', {
      method: 'GET'
    })
  },

  /* 4 POST /management/connection/:user_connection_request_id
   * Accept a connection request
   */
  respondConnectionRequest: (data) => {
    const requiredFields = [
      'user_connection_request_id',
      'accepted' // true/false (in body)
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/connection/${data.user_connection_request_id}`, {
        body: JSON.stringify({ accepted: data.accepted }),
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 5 DELETE
   * Delete a connection /management/connection/:user_connection_id
   */
  deleteConnection: (data) => {
    const requiredFields = [
      'user_connection_id'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/connection/${data.user_connection_id}`, {
        method: 'DELETE'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 6 GET /management/activation/:activation_code
   * Activate a newly created account
   */
  activate: (data) => {
    const requiredFields = [
      'activation_code'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/activation/${data.activation_code}`, {
        method: 'GET'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  // management/isa - post - to, requested_schemas, purpose, license
  /* 7 POST /management/isa
   * Request an ISA
   */
  requestISA: (data) => {
    const requiredFields = [
      'to',
      'requested_schemas',
      'purpose',
      'license'
    ]
    if (containsRequired(requiredFields, data)) {
      return request('/management/isa', {
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 8 POST /management/isa/:isar_id
   * Respond to an ISA request
   */
  respondISA: (data) => {
    const requiredFields = [
      'accepted',
      'permitted_resources'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/isa/${data.isar_id}`, {
        method: 'POST'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 9 GET /management/isa
   * Get all ISAs
   */
  allISAs: () => {
    return request('/management/isa', {
      method: 'GET'
    })
  },

  /* 10 GET /management/isa/:isa_id
   * Get an ISA by id
   */
  getISA: (data) => {
    const requiredFields = [
      'isa_id'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/isa/${data.isa_id}`, {
        method: 'GET'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 11 DELETE /management/isa/:isa_id
   * Delete an ISA
   */
  deleteISA: (data) => {
    const requiredFields = [
      'isa_id'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/isa/${data.isa_id}`, {
        method: 'DELETE'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 12 GET /demo/qr/:user_id
   * Demo QR code
   */
  qrCode: (data) => {
    const requiredFields = [
      'user_id'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/qr/${data.user_id}`, {
        method: 'GET'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 13 PUT /management/isa/:isa_id
   * Update an ISA by id
   */
  updateISA: (data) => {
    const requiredFields = [
      'isa_id',
      'permitted_resources'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/isa/${data.isa_id}`, {
        method: 'PUT',
        body: JSON.stringify(data.permitted_resources)
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 14 GET /management/pull/:isa_id
   * Pull an ISA
   */
  pullISA: (data) => {
    const requiredFields = [
      'isa_id'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/pull/${data.isa_id}`, {
        method: 'GET'
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  },

  /* 15 POST management/push/:isa_id
   * Pull an ISA
   */
  pushISA: (data) => {
    const requiredFields = [
      'isa_id',
      'resources'
    ]
    if (containsRequired(requiredFields, data)) {
      return request(`/management/push/${data.isa_id}`, {
        method: 'POST',
        body: JSON.stringify({ resources: data.resources })
      })
    } else {
      return Promise.reject(getMissingFieldsMessage(requiredFields))
    }
  }



}
