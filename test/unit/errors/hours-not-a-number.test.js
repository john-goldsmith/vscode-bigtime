const BaseError = require('../../../errors/base')
const HoursNotANumberError = require('../../../errors/hours-not-a-number')

describe('Errors', () => {

  describe('HoursNotANumberError', () => {

    it('extends the Error class', () => {
      expect(HoursNotANumberError.prototype instanceof BaseError).toBe(true)
    })

    describe('constructor', () => {

      describe('when no message is provided', () => {

        it('uses a default message', () => {
          const instance = new HoursNotANumberError()
          expect(instance.name).toBe('HoursNotANumberError')
          expect(instance.message).toBe('Default hours must be a number')
        })

      })

      describe('when a message is provided', () => {

        it('uses the provided message', () => {
          const instance = new HoursNotANumberError('foobar')
          expect(instance.name).toBe('HoursNotANumberError')
          expect(instance.message).toBe('foobar')
        })

      })

      describe('when Error.captureStackTrace is truthy', () => {

        it('maintains proper stack traces', () => {
          const captureStackTraceSpy = jest.spyOn(Error, 'captureStackTrace')
          new HoursNotANumberError()
          expect(captureStackTraceSpy).toHaveBeenCalled()
          captureStackTraceSpy.mockRestore()
        })

      })

      describe('when Error.captureStackTrace is falsey', () => {

        it('does not maintain proper stack traces', () => {
          const originalCaptureStackTrace = Error.captureStackTrace
          Error.captureStackTrace = false
          new HoursNotANumberError()
          Error.captureStackTrace = originalCaptureStackTrace
        })

      })

    })

  })

})