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
    return Crypto.getKeyStoreList()
    .then(keystoreList => {
      const exists = keystoreList.find(x => x === Config.keystore.name)
      if (exists) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    })

  }

  static create(password) {
    return Crypto.createKeyStore(Config.keyStoreName, password)
  }
}
