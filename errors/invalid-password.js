/**
 * @module errors/invalid-password
 */

const BaseError = require('./base')

/**
 * @class
 */
class InvalidPasswordError extends BaseError {

  /**
   * Creates an instance of InvalidPasswordError.
   *
   * @param {String} message
   */
  constructor(message = 'Invalid password') {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPasswordError);
    }
    // this.date = new Date()
    // this.code = ...
    this.name = this.constructor.name
  }

}

module.exports = InvalidPasswordError
