const BaseError = require('../../../errors/base')
const NegativeDefaultHoursError = require('../../../errors/negative-default-hours')

describe('Errors', () => {

  describe('NegativeDefaultHoursError', () => {

    it('extends the Error class', () => {
      expect(NegativeDefaultHoursError.prototype instanceof BaseError).toBe(true)
    })

    describe('constructor', () => {

      describe('when no message is provided', () => {

        it('uses a default message', () => {
          const instance = new NegativeDefaultHoursError()
          expect(instance.name).toBe('NegativeDefaultHoursError')
          expect(instance.message).toBe('Default hours can not be negative')
        })

      })

      describe('when a message is provided', () => {

        it('uses the provided message', () => {
          const instance = new NegativeDefaultHoursError('foobar')
          expect(instance.name).toBe('NegativeDefaultHoursError')
          expect(instance.message).toBe('foobar')
        })

      })

      describe('when Error.captureStackTrace is truthy', () => {

        it('maintains proper stack traces', () => {
          const captureStackTraceSpy = jest.spyOn(Error, 'captureStackTrace')
          new NegativeDefaultHoursError()
          expect(captureStackTraceSpy).toHaveBeenCalled()
          captureStackTraceSpy.mockRestore()
        })

      })

      describe('when Error.captureStackTrace is falsey', () => {

        it('does not maintain proper stack traces', () => {
          const originalCaptureStackTrace = Error.captureStackTrace
          Error.captureStackTrace = false
          new NegativeDefaultHoursError()
          Error.captureStackTrace = originalCaptureStackTrace
        })

      })

    })

  })

})