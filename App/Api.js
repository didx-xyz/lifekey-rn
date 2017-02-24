/**
 * Early Childhood Development App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

/* global fetch FormData */
import Config from './Config'
// import Sentry from './Sentry'
import Logger from './Logger'

function request(route, opts) {
  const options = opts || { method: 'GET' }
  if (Config.debug && Config.debugNetwork) {
    Logger.networkRequest(options.method, new Date(), Config.http.baseUrl + route)
  } else {
    // Sentry.addBreadcrumb('HTTP ' + options.method, Config.http.baseUrl + route)
  }

  return fetch(Config.http.baseUrl + route, options)

  // Response received
  .then((response) => {
    if (Config.debug && Config.debugNetwork) {
      Logger.networkResponse(response.status, new Date(), response._bodyText)
    } else {
      // Sentry.addHttpBreadcrumb(Config.http.baseUrl + route, options.method, response.status)
    }
    return response.json()
  })

  .then((json) => {
    if (json.error) {
      return { error: json.error.toString() }
    } else {
      return json
    }
  })

  // On reject
  .catch((error) => {
    if (Config.debug && Config.debugNetwork) {
      Logger.error('API Error', error)
      return Promise.reject(error.toString())
    } else {
      return Promise.reject(error.toString())
    }
  })
}

const containsRequired = (requiredFields, data) =>
  JSON.stringify(requiredFields.sort()) ===
  JSON.stringify(Object.keys(data).sort())

/** API functions avaialble to the App */
export default {

  register: (data) => {
    // check integrity
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
          body: JSON.stringify(data)
        })
      } else {
        return reject("Missing fields")
      }
    })

  },

}
