/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Crypto from '../Crypto'
import Config from '../Config'

export default class ConsentKeystore {

  static exists() {
    return new Promise((resolve, reject) => {
      return Crypto.getKeyStoreIsLoaded()
      .then(_loaded => {
        if (_loaded) {
          return Crypto.getKeyStoreList()
        } else {
          resolve(false)
        }
      })
      .then(_keystoreList => {
        if (_keystoreList.find(x => x === Config.keystore.name)) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch(error => reject(error))
    })
  }

  static create(password) {
    return Crypto.createKeyStore(Config.keyStoreName, password)
  }
}
