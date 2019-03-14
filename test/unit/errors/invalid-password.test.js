const BaseError = require('../../../errors/base')
const InvalidPasswordError = require('../../../errors/invalid-password')

describe('Errors', () => {

  describe('InvalidPasswordError', () => {

    it('extends the Error class', () => {
      expect(InvalidPasswordError.prototype instanceof BaseError).toBe(true)
    })

    describe('constructor', () => {

      describe('when no message is provided', () => {

        it('uses a default message', () => {
          const instance = new InvalidPasswordError()
          expect(instance.name).toBe('InvalidPasswordError')
          expect(instance.message).toBe('Invalid password')
        })

      })

      describe('when a message is provided', () => {

        it('uses the provided message', () => {
          const instance = new InvalidPasswordError('foobar')
          expect(instance.name).toBe('InvalidPasswordError')
          expect(instance.message).toBe('foobar')
        })

      })

      describe('when Error.captureStackTrace is truthy', () => {

        it('maintains proper stack traces', () => {
          const captureStackTraceSpy = jest.spyOn(Error, 'captureStackTrace')
          new InvalidPasswordError()
          expect(captureStackTraceSpy).toHaveBeenCalled()
          captureStackTraceSpy.mockRestore()
        })

      })

      describe('when Error.captureStackTrace is falsey', () => {

        it('does not maintain proper stack traces', () => {
          const originalCaptureStackTrace = Error.captureStackTrace
          Error.captureStackTrace = false
          new InvalidPasswordError()
          Error.captureStackTrace = originalCaptureStackTrace
        })

      })

    })

  })

})