const BaseError = require('../../../errors/base')
const ExceededMaximumHoursError = require('../../../errors/exceeded-maximum-hours')

describe('Errors', () => {

  describe('ExceededMaximumHoursError', () => {

    it('extends the Error class', () => {
      expect(ExceededMaximumHoursError.prototype instanceof BaseError).toBe(true)
    })

    describe('constructor', () => {

      describe('when no message is provided', () => {

        it('uses a default message', () => {
          const instance = new ExceededMaximumHoursError()
          expect(instance.name).toBe('ExceededMaximumHoursError')
          expect(instance.message).toBe('Default hours can not be greater than 24')
        })

      })

      describe('when a message is provided', () => {

        it('uses the provided message', () => {
          const instance = new ExceededMaximumHoursError('foobar')
          expect(instance.name).toBe('ExceededMaximumHoursError')
          expect(instance.message).toBe('foobar')
        })

      })

      describe('when Error.captureStackTrace is truthy', () => {

        it('maintains proper stack traces', () => {
          const captureStackTraceSpy = jest.spyOn(Error, 'captureStackTrace')
          new ExceededMaximumHoursError()
          expect(captureStackTraceSpy).toHaveBeenCalled()
          captureStackTraceSpy.mockRestore()
        })

      })

      describe('when Error.captureStackTrace is falsey', () => {

        it('does not maintain proper stack traces', () => {
          const originalCaptureStackTrace = Error.captureStackTrace
          Error.captureStackTrace = false
          new ExceededMaximumHoursError()
          Error.captureStackTrace = originalCaptureStackTrace
        })

      })

    })

  })

})