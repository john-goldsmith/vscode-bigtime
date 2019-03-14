const vscode = require('vscode')

const getDefaults = require('../../../commands/get-defaults')

describe('Commands', () => {

  describe('getDefaults', () => {

    it('returns a function', () => {
      expect(typeof getDefaults()).toBe('function')
    })

    describe('when default project is truthy', () => {

      it('shows an informational message', () => {
        const context = {
          globalState: {
            get: jest.fn().mockImplementation(() => ({
              label: 'projectLabel'
            }))
          }
        }
        getDefaults(context)()
        expect(context.globalState.get).toHaveBeenCalledWith('defaultProject')
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Default project: projectLabel')
        vscode.window.showInformationMessage.mockClear()
      })

    })

    describe('when default project is falsey', () => {

      it('shows an informational message', () => {
        const context = {
          globalState: {
            get: jest.fn().mockImplementation(() => false)
          }
        }
        getDefaults(context)()
        expect(context.globalState.get).toHaveBeenCalledWith('defaultProject')
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Default project not set')
        vscode.window.showInformationMessage.mockClear()
      })

    })

    describe('when default category is truthy', () => {

      it('shows an informational message', () => {
        const context = {
          globalState: {
            get: jest.fn().mockImplementation(() => ({
              label: 'categoryLabel'
            }))
          }
        }
        getDefaults(context)()
        expect(context.globalState.get).toHaveBeenCalledWith('defaultCategory')
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Default category: categoryLabel')
        vscode.window.showInformationMessage.mockClear()
      })

    })
    describe('when default category is falsey', () => {

      it('shows an informational message', () => {
        const context = {
          globalState: {
            get: jest.fn().mockImplementation(() => false)
          }
        }
        getDefaults(context)()
        expect(context.globalState.get).toHaveBeenCalledWith('defaultCategory')
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Default category not set')
        vscode.window.showInformationMessage.mockClear()
      })

    })

    describe('when default hours is not an empty string', () => {

      it('shows an informational message', () => {
        const context = {
          globalState: {
            get: jest.fn().mockImplementation(() => '8')
          }
        }
        getDefaults(context)()
        expect(context.globalState.get).toHaveBeenCalledWith('defaultHours')
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Default hours: 8')
        vscode.window.showInformationMessage.mockClear()
      })

    })

    describe('when default hours is an empty string', () => {

      it('shows an informational message', () => {
        const context = {
          globalState: {
            get: jest.fn().mockImplementation(() => '')
          }
        }
        getDefaults(context)()
        expect(context.globalState.get).toHaveBeenCalledWith('defaultHours')
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Default hours not set')
        vscode.window.showInformationMessage.mockClear()
      })

    })

  })

})
