/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
/* eslint-disable no-console */
import ANSI from 'ansi-styles'
import * as Lifecycle from './Lifecycle'
import Config from './Config'

export default class Logger {

  /**
   * Log something with a prefix, forground and background colour
   * @param {string} prefix Prefix text
   * @param {string} text Text to log
   * @param {Ansi.color} fgColor Foreground colour
   * @param {Ansi.bgColor} bgColor Background colour
   * @returns {undefined}
   */
  static _log(prefix, text, fgColor, bgColor = ANSI.bgBlack) {
    if (Config.debug) {
      console.log(`${prefix}${bgColor.open}${fgColor.open}${text}${fgColor.close}${bgColor.close}`)
    }
  }

  static _asColumn(text, width = 100) {
    const nSpaces = width - text.length
    if (nSpaces < 0) {
      return text
    }
    const spaces = Array(nSpaces).join(' ')
    return text + spaces
  }

  /**
   * Log an AsyncStorage action
   * @param {string} message The message to log
   * @returns {undefined}
   */
  static async = message => {
    const prefix = `${ANSI.cyan.open}[AS]${ANSI.cyan.close} `
    if (Config.debug && Config.debugAsyncStorage) {
      Logger._log(prefix, message, ANSI.yellow)
    }
  }

  /**
   * Log a network request
   * @param {string} method The HTTP method
   * @param {string} timestamp The timestamp
   * @param {string} route The route to log
   * @returns {undefined}
   */
  static networkRequest = (method, timestamp, route) => {
    const prefix = `${ANSI.blue.open}[NW]${ANSI.blue.close}`
    const methodColor = `${ANSI.bold.open}${ANSI.green.open}${method}${ANSI.green.close}${ANSI.bold.close}`
    const timestampColor = `${ANSI.gray.open}${ANSI.underline.open}${timestamp}${ANSI.underline.close}${ANSI.gray.close}`
    const routeColor = `${ANSI.white.open}${route}${ANSI.white.close}`
    if (Config.debug && Config.debugNetwork) {
      console.log(`${prefix} ${methodColor} ${Logger._asColumn(timestampColor, 64)} ${routeColor}`)
    }
  }

  /**
   * Log a network response
   * @param {string} status The response status code
   * @param {string} timestamp The timestamp
   * @param {any} data The data to log
   * @returns {undefined}
   */
  static networkResponse = (status, timestamp, data) => {
    const prefix = `${ANSI.blue.open}[NW]${ANSI.blue.close}`

    const codes = [
      { code: 200, color: ANSI.green },
      { code: 401, color: ANSI.yellow },
      { code: 500, color: ANSI.red },
      { code: 404, color: ANSI.yellow }
    ].find(item => status === item.code ? item.color : false) ||
    { code: status || 'unknown', color: ANSI.white }

    const timestampColor = `${ANSI.gray.open}${ANSI.underline.open}${timestamp}${ANSI.underline.close}${ANSI.gray.close}`

    const statusColor = `${codes.color.open}${status}${codes.color.close}`
    if (Config.debug && Config.debugNetwork) {
      console.log(`${prefix} ${statusColor} ${timestampColor}`)
      console.log(data)
    }

  }

  /**
   * Log an error
   * @param {string} message The message to log
   * @param {string} filename The filename to log
   * @returns {undefined}
   */
  static error = (message, filename) => {
    const prefix = `${ANSI.bgRed.open}${ANSI.white.open}[ER]${ANSI.white.close}${ANSI.bgRed.close}`
    if (Config.debug) {
      console.log(`${prefix} ${filename} ${ANSI.red.open} ${message}${ANSI.red.close}`)
    }
  }

  /**
   * Log an info
   * @param {string} message The message to log
   * @param {string} filename The filename to log
   * @returns {undefined}
   */
  static info = (message, filename) => {
    const prefix = `${ANSI.bgGreen.open}${ANSI.white.open}[i]${ANSI.white.close}${ANSI.bgGreen.close}`
    if (Config.debug) {
      console.log(`${prefix} ${filename} ${ANSI.white.open} ${message}${ANSI.white.close}`)
    }
  }

  /**
   * Log a firebase info
   * @param {string} message The message to log
   * @param {string} filename The filename to log
   * @returns {undefined}
   */
  static firebase = (message, filename) => {
    const prefix = `${ANSI.bgBlack.open}${ANSI.red.open}[FB]${ANSI.red.close}${ANSI.bgBlack.close}`
    if (Config.debug && Config.debugFirebase) {
      console.log(`${prefix} ${filename} ${ANSI.white.open} ${message}${ANSI.white.close}`)
    }
  }

  /**
   * Log a React lifecycle method
   * @param {string} filename The filename to log
   * @param {string} event The react event to log
   * @returns {undefined}
   */
  static react = (filename, event) => {

    const prefix = `${ANSI.red.open}[LC]${ANSI.red.close} `

    switch (event) {
    case Lifecycle.CONSTRUCTOR:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.white, ANSI.bgBlack)
      break

    case Lifecycle.COMPONENT_WILL_MOUNT:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.black, ANSI.bgGreen)
      break

    case Lifecycle.COMPONENT_WILL_FOCUS:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.green, ANSI.bgBlack)
      break

    case Lifecycle.COMPONENT_DID_MOUNT:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.black, ANSI.bgYellow)
      break

    case Lifecycle.COMPONENT_DID_FOCUS:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.magenta)
      break

    case Lifecycle.COMPONENT_WILL_RECEIEVE_PROPS:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.cyan)
      break

    case Lifecycle.SHOULD_COMPONENT_UPDATE:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.gray, ANSI.bgWhite)
      break

    case Lifecycle.COMPONENT_WILL_UPDATE:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.magenta, ANSI.bgWhite)
      break

    case Lifecycle.COMPONENT_DID_UPDATE:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.blue, ANSI.bgWhite)
      break

    case Lifecycle.RENDER:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.gray, ANSI.bgBlack)
      break

    case Lifecycle.COMPONENT_WILL_UNMOUNT:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.black, ANSI.bgRed)
      break

    default:
      Logger._log(
        prefix,
        Logger._asColumn(filename, 30) + Logger._asColumn(event, 30),
        ANSI.black, ANSI.bgWhite)
      break

    }
  }
}

