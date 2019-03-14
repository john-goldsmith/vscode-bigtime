const BaseError = require('../../../errors/base')
const NotLoggedInError = require('../../../errors/not-logged-in')

describe('Errors', () => {

  describe('NotLoggedInError', () => {

    it('extends the Error class', () => {
      expect(NotLoggedInError.prototype instanceof BaseError).toBe(true)
    })

    describe('constructor', () => {

      describe('when no message is provided', () => {

        it('uses a default message', () => {
          const instance = new NotLoggedInError()
          expect(instance.name).toBe('NotLoggedInError')
          expect(instance.message).toBe('Please login before continuing')
        })

      })

      describe('when a message is provided', () => {

        it('uses the provided message', () => {
          const instance = new NotLoggedInError('foobar')
          expect(instance.name).toBe('NotLoggedInError')
          expect(instance.message).toBe('foobar')
        })

      })

      describe('when Error.captureStackTrace is truthy', () => {

        it('maintains proper stack traces', () => {
          const captureStackTraceSpy = jest.spyOn(Error, 'captureStackTrace')
          new NotLoggedInError()
          expect(captureStackTraceSpy).toHaveBeenCalled()
          captureStackTraceSpy.mockRestore()
        })

      })

      describe('when Error.captureStackTrace is falsey', () => {

        it('does not maintain proper stack traces', () => {
          const originalCaptureStackTrace = Error.captureStackTrace
          Error.captureStackTrace = false
          new NotLoggedInError()
          Error.captureStackTrace = originalCaptureStackTrace
        })

      })

    })

  })

})