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
  E_ACCESS_KEYSTORE_NOT_LOADED: 0x1021,
  E_CONSENT_USER_COULD_NOT_LOGIN: 0x1031,
  E_CONSENT_USER_COULD_NOT_LOGOUT: 0x1032,
  // 6000 FATAL
  E_API_FATAL_ERROR: 0x6011
}

export default class ConsentError extends Error {

  constructor(message, code) {
    super(message)
    this.name = message || 'ConsentError'
    this.message = message || 'ConsentError'
    this.code = code || 0x29a
    Logger.error(message, this.code)
  }

}
