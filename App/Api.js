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
    method: "GET",
    headers: {
      "content-type":  "application/json"
    }
  }, opts)

  // Logging
  Logger.networkRequest(options.method, new Date(), Config.http.baseUrl + route)
  if (opts.body) {
    console.log(opts.body)
  }
  return fetch(Config.http.baseUrl + route, options)
  .then((response) => {
    if (Config.debug && Config.debugNetwork) {
      Logger.networkResponse(response.status, new Date(), response._bodyText)
    }
    return response.json()
  })
  .then((json) => {
    if (json.error) {
      return Promise.reject({ error: json.error.toString() })
    } else {
      return Promise.resolve(json)
    }
  })
  .catch((error) => {
    Logger.error('API Error', error)
    return Promise.reject(error.toString())
  })
}

const containsRequired = (requiredFields, data) =>
  JSON.stringify(requiredFields.sort()) ===
  JSON.stringify(Object.keys(data).sort())

/** API functions avaialble to the App */
export default {

  register: (data) => {
    return new Promise((resolve, reject) => {

      const requiredFields = [
        "email",
        "nickname",
        "device_id",
        "device_platform",
        "public_key_algorithm",
        "public_key",
        "plaintext_proof",
        "signed_proof"
      ]

      if (containsRequired(requiredFields, data)) {
        return request('/management/register', {
          body: JSON.stringify(data),
          method: "POST"
        })
      } else {
        return reject("Missing fields")
      }
    })

  },

}
