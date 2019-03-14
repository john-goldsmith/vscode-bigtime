const BaseError = require('../../../errors/base')
const InvalidEmailError = require('../../../errors/invalid-email')

describe('Errors', () => {

  describe('InvalidEmailError', () => {

    it('extends the Error class', () => {
      expect(InvalidEmailError.prototype instanceof BaseError).toBe(true)
    })

    describe('constructor', () => {

      describe('when no message is provided', () => {

        it('uses a default message', () => {
          const instance = new InvalidEmailError()
          expect(instance.name).toBe('InvalidEmailError')
          expect(instance.message).toBe('Invalid email')
        })

      })

      describe('when a message is provided', () => {

        it('uses the provided message', () => {
          const instance = new InvalidEmailError('foobar')
          expect(instance.name).toBe('InvalidEmailError')
          expect(instance.message).toBe('foobar')
        })

      })

      describe('when Error.captureStackTrace is truthy', () => {

        it('maintains proper stack traces', () => {
          const captureStackTraceSpy = jest.spyOn(Error, 'captureStackTrace')
          new InvalidEmailError()
          expect(captureStackTraceSpy).toHaveBeenCalled()
          captureStackTraceSpy.mockRestore()
        })

      })

      describe('when Error.captureStackTrace is falsey', () => {

        it('does not maintain proper stack traces', () => {
          const originalCaptureStackTrace = Error.captureStackTrace
          Error.captureStackTrace = false
          new InvalidEmailError()
          Error.captureStackTrace = originalCaptureStackTrace
        })

      })

    })

  })

})