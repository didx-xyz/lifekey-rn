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
      return Crypto.getKeyStoreList()
      .then(list => {
        if (list.find(x => x === Config.keyStoreName)) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  static create(password) {
    return Crypto.createKeyStore(Config.keyStoreName, password)
  }
}
