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

/** API functions avaialble to the App */
export default {
  doAuthenticatedRequest: async function (uri, method, body) {
    var toSign = Date.now().toString()
    var caught = false
    try {
      var name = await Crypto.getCurrentKeyStoreAlias()
    } catch (e) {
      caught = true
    }
    try {
      if (caught) name = await Crypto.loadKeyStore('consent', Session.state.userPassword)
      var signature = await Crypto.sign(toSign, 'private_lifekey', Session.state.userPassword, Crypto.SIG_SHA256_WITH_RSA)
      var opts = {
        method: method || 'get',
        headers: {
          "content-type": "application/json",
          'x-cnsnt-id': Session.getState().dbUserId,
          'x-cnsnt-plain': toSign,
          'x-cnsnt-signed': signature.trim()
        }
      }
      if (typeof body === 'object' && body !== null) {
        opts.body = JSON.stringify(body)
      }
      var response = await fetch(uri, opts)
      return (await response.json())
    } catch (e) {
      return {error: true, message: e.toString()}
    }
  },
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
      return Promise.reject('Missing fields')
    }

  },

}
