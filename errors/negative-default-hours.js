/**
 * @module errors/negative-default-hours
 */

const BaseError = require('./base')

/**
 * @class
 */
class NegativeDefaultHoursError extends BaseError {

  /**
   * Creates an instance of NegativeDefaultHoursError.
   *
   * @param {String} message
   */
  constructor(message = 'Default hours can not be negative') {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NegativeDefaultHoursError);
    }
    // this.date = new Date()
    // this.code = ...
    this.name = this.constructor.name
  }

}

module.exports = NegativeDefaultHoursError
