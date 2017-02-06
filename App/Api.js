/**
 * Early Childhood Development App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

/* global fetch FormData */
import Config from './Config'
import Sentry from './Sentry'
import Logger from './Logger'

function request(route, opts) {
  const options = opts || { method: 'GET' }
  if (Config.debug && Config.debugNetwork) {
    Logger.networkRequest(options.method, new Date(), Config.http.baseUrl + route)
  } else {
    Sentry.addBreadcrumb('HTTP ' + options.method, Config.http.baseUrl + route)
  }

  return fetch(Config.http.baseUrl + route, options)

  // Response received
  .then((response) => {
    if (Config.debug && Config.debugNetwork) {
      Logger.networkResponse(response.status, new Date(), response._bodyText)
    } else {
      Sentry.addHttpBreadcrumb(Config.http.baseUrl + route, options.method, response.status)
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
      return Promise.reject(error)
    }
  })
}

/** API functions avaialble to the App */
export default {

  /**
   * Register a new yser
   * @memberof Api
   * @param {string} email
   * @param {string} password
   * @returns {undefined}
   */
  register: (email, password) => {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('pasword', password)
    return request('management/register', {
      body: formData,
      method: 'POST',
      headers: Config.http.headers
    })
  },

}
