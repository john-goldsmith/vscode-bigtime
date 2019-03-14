/**
 * @module errors/not-logged-in
 */

const BaseError = require('./base')

/**
 * @class
 */
class NotLoggedInError extends BaseError {

  /**
   * Creates an instance of NotLoggedInError.
   *
   * @param {String} message
   */
  constructor(message = 'Please login before continuing') {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotLoggedInError);
    }
    // this.date = new Date()
    // this.code = ...
    this.name = this.constructor.name
  }

}

module.exports = NotLoggedInError
