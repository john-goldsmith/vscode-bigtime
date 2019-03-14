const InvalidPasswordError = require('./invalid-password')
const InvalidEmailError = require('./invalid-email')
const NotLoggedInError = require('./not-logged-in')
const NegativeDefaultHoursError = require('./negative-default-hours')
const ExceededMaximumHoursError = require('./exceeded-maximum-hours')
const HoursNotANumberError = require('./hours-not-a-number')

module.exports = {
  InvalidPasswordError,
  InvalidEmailError,
  NotLoggedInError,
  NegativeDefaultHoursError,
  ExceededMaximumHoursError,
  HoursNotANumberError
}
