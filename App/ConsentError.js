/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za> et al.
 */
import Logger from './Logger'
export const ErrorCode = {
  // 0000 SPECIAL
  E_UNKNOWN: 0x029a,
  // 1000 RECOVERABLE
  E_API_ERROR: 0x1011,
  E_ACCESS_KEYSTORE_NOT_LOADED: 0x0021
  // 6000 FATAL
}

export default class ConsentError extends Error {

  constructor(message, code) {
    super(message)
    this.name = 'ConsentError'
    this.message = message || 'ConsentError'
    this.code = 0x29a || code
    Logger.error(message, this.code)
  }

}
