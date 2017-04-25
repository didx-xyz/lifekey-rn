// internal dependencies
import Config from "./Config"
import Crypto from "./Crypto"
import Logger from "./Logger"
import ConsentUser from "./Models/ConsentUser"
import ConsentError, { ErrorCode } from "./ConsentError"

const request = function(url, opts, shouldBeSigned = true) {
  if (url.indexOf("http") !== 0) {
    url = Config.http.baseUrl + url
  }

  if (shouldBeSigned) {
    return signedRequest(url, opts)
  }

  return unsignedRequest(url, opts)
}

const signedRequest = function(url, opts) {
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
        Config.keystore.privateKeyName,
        ConsentUser.getPasswordSync(),
        Crypto.SIG_SHA256_WITH_RSA
      )
    })
    .then(signature => {
      const options = Object.assign({
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "x-cnsnt-id": userID,
          "x-cnsnt-plain": secureRandom,
          "x-cnsnt-signed": signature
        }
      }, opts)

      return wrappedFetch(url, options)
    })
}

const rejectionWithError = function(message) {
  return Promise.reject(new ConsentError(message))
}

const wrappedFetch = function(url, options) {
  Logger.networkRequest(options.method, url, options)
  return fetch(url, options).then(onResponse)
}

const onResponse = function(response) {
  Logger.networkResponse(response.status, new Date(), response._bodyText)

  switch (parseInt(response.status, 10)) {
    case 502:
      Logger.error("502 Bad gateway", "Api.js", response)
      return rejectionWithError("502 Bad Gateway from server")
    case 500:
      Logger.error("500 Internal server error", "Api.js", response)
      return rejectionWithError("Internal server error")
    case 400:
      alert(response.text())
      Logger.error("400 Bad request", "Api.js", response)
      return rejectionWithError(response._bodyText)
    case 201:
      Logger.info("201 Created", "Api.js", response)
      return response.json()
    case 200:
      Logger.info("200 Okay", "Api.js", response)
      return response.json()
  }

  return rejectionWithError(JSON.stringify(response))
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
