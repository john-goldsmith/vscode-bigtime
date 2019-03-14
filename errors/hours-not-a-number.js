/**
 * @module errors/hours-not-a-number
 */

const BaseError = require('./base')

/**
 * @class
 */
class HoursNotANumberError extends BaseError {

  /**
   * Creates an instance of HoursNotANumberError.
   *
   * @param {String} message
   */
  constructor(message = 'Default hours must be a number') {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HoursNotANumberError);
    }
    // this.date = new Date()
    // this.code = ...
    this.name = this.constructor.name
  }

}

module.exports = HoursNotANumberError
