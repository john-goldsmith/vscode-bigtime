const vscode = require('vscode')

const bigTime = require('../../../bigtime')
const login = require('../../../commands/login')

describe('Commands', () => {

  describe('login', () => {

    it('returns a function', () => {
      expect(typeof login()).toBe('function')
    })

    describe('when an email is not provided', () => {

      it('returns', async () => {
        vscode.window.showInputBox = jest.fn().mockImplementation(() => {
          return Promise.resolve(undefined)
        })
        await login()()
        expect(vscode.window.showInputBox).toHaveBeenCalledWith({
          prompt: 'Email'
        })
        expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
      })

    })

    describe('when the email is an empty string', () => {

      it('shows an error message', async () => {
        vscode.window.showInputBox = jest.fn().mockImplementation(() => {
          return Promise.resolve('')
        })
        await login()()
        expect(vscode.window.showInputBox).toHaveBeenCalledWith({
          prompt: 'Email'
        })
        expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
        expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Invalid email')
      })

    })

    describe('🙂 when an email is provided', () => {

      describe('when a password is not provided', () => {

        it('returns', async () => {
          vscode.window.showInputBox = jest.fn()
            .mockImplementationOnce(() => {
              return Promise.resolve('you@email.com')
            })
            .mockImplementationOnce(() => {
              return Promise.resolve(undefined)
            })
          await login()()
          expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {
            prompt: 'Email'
          })
          expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(2, {
            prompt: 'Password',
            password: true
          })
          expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
        })

      })

      describe('when the password is an empty string', () => {

        it('shows an error message', async () => {
          vscode.window.showInputBox = jest.fn()
            .mockImplementationOnce(() => {
              return Promise.resolve('you@email.com')
            })
            .mockImplementationOnce(() => {
              return Promise.resolve('')
            })
          await login()()
          expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {
            prompt: 'Email'
          })
          expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(2, {
            prompt: 'Password',
            password: true
          })
          expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
          expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Invalid password')
        })

      })

      describe('🙂 when a password is provided', () => {

        describe('when a session is not successfully created', () => {

          it('shows an error message', async () => {
            vscode.window.showInputBox = jest.fn()
              .mockImplementationOnce(() => {
                return Promise.resolve('you@email.com')
              })
              .mockImplementationOnce(() => {
                return Promise.resolve('s3cr3t')
              })
            const progress = {
              report: jest.fn()
            }
            vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
              cb(progress)
            })
            const createSessionSpy = jest.spyOn(bigTime, 'createSession').mockImplementation(() => {
              throw new Error('foo')
            })
            await login()()
            expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {
              prompt: 'Email'
            })
            expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(2, {
              prompt: 'Password',
              password: true
            })
            expect(progress.report).toHaveBeenCalledWith({message: 'Logging in...'})
            expect(createSessionSpy).toHaveBeenCalled()
            expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('foo')
          })

        })

        describe('🙂 when a session is successfully created', () => {

          it('🙂 shows an informational message', async () => {
            vscode.window.showInputBox = jest.fn()
              .mockImplementationOnce(() => {
                return Promise.resolve('you@email.com')
              })
              .mockImplementationOnce(() => {
                return Promise.resolve('s3cr3t')
              })
            const progress = {
              report: jest.fn()
            }
            vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
              cb(progress)
            })
            const createSessionSpy = jest.spyOn(bigTime, 'createSession').mockImplementation(() => {})
            await login()()
            expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {
              prompt: 'Email'
            })
            expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(2, {
              prompt: 'Password',
              password: true
            })
            expect(progress.report).toHaveBeenCalledWith({message: 'Logging in...'})
            expect(createSessionSpy).toHaveBeenCalled()
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Successfully logged in to BigTime')
          })

        })

      })

    })

  })

})
