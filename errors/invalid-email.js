/**
 * @module errors/invalid-email
 */

const BaseError = require('./base')

/**
 * @class
 */
class InvalidEmailError extends BaseError {

  /**
   * Creates an instance of InvalidEmailError.
   *
   * @param {String} message
   */
  constructor(message = 'Invalid email') {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidEmailError);
    }
    // this.date = new Date()
    // this.code = ...
    this.name = this.constructor.name
  }

}

module.exports = InvalidEmailError
