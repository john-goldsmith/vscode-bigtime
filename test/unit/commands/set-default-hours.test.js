const vscode = require('vscode')

const setDefaultHours = require('../../../commands/set-default-hours')

describe('Commands', () => {

  describe('setDefaultHours', () => {

    it('returns a function', () => {
      expect(typeof setDefaultHours()).toBe('function')
    })

    describe('when hours are not provided', () => {

      it('returns', () => {
        vscode.window.showInputBox = jest.fn().mockImplementation(() => {
          return Promise.resolve(undefined)
        })
        const context = {
          globalState: {
            update: jest.fn()
          }
        }
        setDefaultHours(context)()
        expect(vscode.window.showInputBox).toHaveBeenCalledWith({
          prompt: 'Default hours (0 - 24, leave blank to unset)'
        })
        expect(context.globalState.update).not.toHaveBeenCalled()
      })

    })

    describe('🙂 when hours are an empty string', () => {

      it('🙂 unsets the global state and shows an informational message', async () => {
        vscode.window.showInputBox = jest.fn().mockImplementation(() => {
          return Promise.resolve('')
        })
        const context = {
          globalState: {
            update: jest.fn()
          }
        }
        await setDefaultHours(context)()
        expect(vscode.window.showInputBox).toHaveBeenCalledWith({
          prompt: 'Default hours (0 - 24, leave blank to unset)'
        })
        expect(context.globalState.update).toHaveBeenCalledWith('defaultHours', '')
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Successfully unset default hours')
      })

    })

    describe('🙂 when hours are not an empty string', () => {

      describe('when hours is negative', () => {

        it('unsets the global state and shows an informational message', async () => {
          vscode.window.showInputBox = jest.fn().mockImplementation(() => {
            return Promise.resolve('-1')
          })
          const context = {
            globalState: {
              update: jest.fn()
            }
          }
          await setDefaultHours(context)()
          expect(vscode.window.showInputBox).toHaveBeenCalledWith({
            prompt: 'Default hours (0 - 24, leave blank to unset)'
          })
          expect(context.globalState.update).not.toHaveBeenCalled()
          expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
          expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Default hours can not be negative')
        })

      })

      describe('when hours is greater than 24', () => {

        it('unsets the global state and shows an informational message', async () => {
          vscode.window.showInputBox = jest.fn().mockImplementation(() => {
            return Promise.resolve('25')
          })
          const context = {
            globalState: {
              update: jest.fn()
            }
          }
          await setDefaultHours(context)()
          expect(vscode.window.showInputBox).toHaveBeenCalledWith({
            prompt: 'Default hours (0 - 24, leave blank to unset)'
          })
          expect(context.globalState.update).not.toHaveBeenCalled()
          expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
          expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Default hours can not be greater than 24')
        })

      })

      describe('when hours is not a number', () => {

        it('unsets the global state and shows an informational message', async () => {
          vscode.window.showInputBox = jest.fn().mockImplementation(() => {
            return Promise.resolve('foo')
          })
          const context = {
            globalState: {
              update: jest.fn()
            }
          }
          await setDefaultHours(context)()
          expect(vscode.window.showInputBox).toHaveBeenCalledWith({
            prompt: 'Default hours (0 - 24, leave blank to unset)'
          })
          expect(context.globalState.update).not.toHaveBeenCalled()
          expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
          expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Default hours must be a number')
        })

      })

      describe('🙂 when hours is a valid number', () => {

        it('🙂 updates global state and shows an informational message', async () => {
          vscode.window.showInputBox = jest.fn().mockImplementation(() => {
            return Promise.resolve('8')
          })
          const context = {
            globalState: {
              update: jest.fn()
            }
          }
          await setDefaultHours(context)()
          expect(vscode.window.showInputBox).toHaveBeenCalledWith({
            prompt: 'Default hours (0 - 24, leave blank to unset)'
          })
          expect(context.globalState.update).toHaveBeenCalledWith('defaultHours', 8)
          expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Successfully set default hours to 8')
        })

      })

    })

  })

})
