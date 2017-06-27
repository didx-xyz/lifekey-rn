// internal dependencies
import Config from "./Config"
import Crypto from "./Crypto"
import Logger from "./Logger"
import ConsentUser from "./Models/ConsentUser"
import ConsentError, { ErrorCode } from "./ConsentError"

const request = function(url, opts, shouldBeSigned = true, fingerprint = false) {
  if (url.indexOf("http") !== 0) {
    url = Config.http.baseUrl + url
  }

  if (shouldBeSigned) {
    return signedRequest(url, opts, fingerprint)
  }

  return unsignedRequest(url, opts)
}

const signedRequest = function(url, opts, fingerprint) {
  if (Config.useWhitelistedUser) {
    return whitelistedSignedRequest(url, opts)
  }

  let userID = null
  let secureRandom = null

  return ConsentUser.get()
    .then(results => {
      if (results.id) {
        userID = results.id
        return Crypto.getKeyStoreIsLoaded()
      }

      return rejectionWithError("User not registered. Cannot send a signed request")
    })
    .then(keystoreLoaded => {
      if (keystoreLoaded) {
        return Crypto.secureRandom()
      }

      return rejectionWithError("Keystore must first be loaded", ErrorCode.E_ACCESS_KEYSTORE_NOT_LOADED)
    })
    .then(_secureRandom => {
      secureRandom = _secureRandom

      return Crypto.sign(
        _secureRandom,
        Config.keystore.privateKeyName + (fingerprint ? 'fingerprint' : '')
        // ConsentUser.getPasswordSync(),
        // Crypto.SIG_SHA256_WITH_RSA
      )
    })
    .then(signature => {
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

const rejectionWithError = function(message) {
  return Promise.reject(new Error(message))
}

const wrappedFetch = function(url, options) {
  if (url.indexOf("?") > -1) {
    url += "&_=" + (new Date()).getTime()
  } else {
    url += "?_=" + (new Date()).getTime()
  }

  Logger.networkRequest(options.method, url, options)

  return fetch(url, options).then(onResponse)
}

const onResponse = function(response) {
  Logger.networkResponse(response.status, new Date(), response._bodyText)

  switch (parseInt(response.status, 10)) {
    case 502:
      Logger.warn("502 Bad gateway", "Api.js", response)
      return rejectionWithError("502 Bad Gateway from server")
    case 500:
      Logger.warn("500 Internal server error", "Api.js", response)
      return rejectionWithError("Internal server error")
    case 400:
      Logger.warn("400 Bad request", "Api.js", response)
      return rejectionWithError(JSON.parse(response._bodyText))
    case 404:
      Logger.warn("404 Not Found", response)
      return rejectionWithError(JSON.parse(response._bodyText))
    case 201:
      return response.json()
    case 200:
      return response.json()
    default:
      return rejectionWithError("Server returned unexpected status " + response.status)
  }
}

const whitelistedSignedRequest = function(url, opts) {
  const options = Object.assign({
    "method": "GET",
    "headers": {
      "x-cnsnt-id": Config.whitelistedUserId,
      "x-cnsnt-plain": Config.whitelistedUserPlain,
      "x-cnsnt-signed": Config.whitelistedUserSigned,
      "content-type": "application/json"
    }
  }, opts)

  return wrappedFetch(url, options)
}

const unsignedRequest = function(url, opts) {
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
  whitelistedSignedRequest,
  unsignedRequest,
  rejectionWithError
}
