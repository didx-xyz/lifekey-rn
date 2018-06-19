// internal dependencies
import Config from "./Config"
import Crypto from "./Crypto"
import Logger from "./Logger"
import ConsentUser from "./Models/ConsentUser"
import ConsentError, { ErrorCode } from "./ConsentError"

const request = function (url, opts, shouldBeSigned = true, fingerprint = false) {
  if (url.indexOf("http") !== 0) {
    url = Config.http.baseUrl + url
  }

  if (shouldBeSigned) {
    return signedRequest(url, opts, fingerprint)
  }

  return unsignedRequest(url, opts)
}

var init_key_store = function () {
  return Crypto.getKeyStoreIsLoaded().then(loaded => {
    return (loaded ? Promise.resolve : Crypto.loadKeyStore)()
  })
}

const signedRequest = function (url, opts, fingerprint) {
  let userID = null
  let secureRandom = null

  return ConsentUser.get().then(results => {
    if (results.id) {
      userID = results.id
      return init_key_store()
    }
    return Promise.reject(
      'User not registered. Cannot send a signed request'
    )
  }).then(_ => {
    return Crypto.secureRandom()
  }).then(_secureRandom => {
    secureRandom = _secureRandom
    return Crypto.sign(
      _secureRandom,
      Config.keystore.keyName + (fingerprint ? 'fingerprint' : '')
    )
  }).then(signature => {
    var headers = {
      "content-type": "application/json",
      "x-cnsnt-id": userID,
      "x-cnsnt-plain": secureRandom,
      "x-cnsnt-signed": signature
    }
    if (fingerprint) headers['x-cnsnt-fingerprint'] = 1
    const options = Object.assign({
      "method": "GET",
      "headers": headers
    }, opts)

    return wrappedFetch(url, options)
  })
}

// const Promise.reject = function(message) {

//   return Promise.reject(new Error(message))
// }


const wrappedFetch = function (url, options) {
  let globalResponseJson;
  let globalResponse;

  if (url.indexOf("?") > -1) {
    url += "&_=" + (new Date()).getTime()
  } else {
    url += "?_=" + (new Date()).getTime()
  }

  Logger.networkRequest(options.method, url, options)

  return fetch(url, options)
    .then(response => {
      globalResponse = response;
      return globalResponseJson = response.json()
    })
    .then(res => {
      let output = JSON.stringify(res)
      Logger.networkResponse(res.status, new Date(), output)

      switch (parseInt(globalResponse.status, 10)) {
        case 502:
          // Logger.warn("502 Bad gateway", "Api.js", response)
          return Promise.reject(res)
        case 500:
          // Logger.warn("500 Internal server error", "Api.js", response)
          return Promise.reject(res)
        case 400:
          // Logger.warn("400 Bad request", "Api.js", response)
          return Promise.reject(res)
        case 404:
          // Logger.warn("404 Not Found", response)
          return Promise.reject(res)
        case 201:
          return globalResponseJson
        case 200:
          return globalResponseJson
        default:
          return Promise.reject(res)
      }
    });
}

const unsignedRequest = function (url, opts) {
  const options = Object.assign({
    "method": "GET",
    "headers": {
      "content-type": "application/json"
    }
  }, opts)

  return wrappedFetch(url, options)
}

export {
  request,
  signedRequest,
  unsignedRequest
  // ,
  // rejectionWithError
}
