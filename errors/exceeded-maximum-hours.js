/**
 * @module errors/exceeded-maximum-hours
 */

const BaseError = require('./base')

/**
 * @class
 */
class ExceededMaximumHoursError extends BaseError {

  /**
   * Creates an instance of ExceededMaximumHoursError.
   *
   * @param {String} message
   */
  constructor(message = 'Default hours can not be greater than 24') {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExceededMaximumHoursError)
    }
    // this.date = new Date()
    // this.code = ...
    this.name = this.constructor.name
  }

}

module.exports = ExceededMaximumHoursError
