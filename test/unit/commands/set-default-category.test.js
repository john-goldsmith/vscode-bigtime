const vscode = require('vscode')
// const { NotLoggedInError } = require('../../../errors')
const bigTime = require('../../../bigtime')
const setDefaultCategory = require('../../../commands/set-default-category')

describe('Commands', () => {

  describe('setDefaultCategory', () => {

    it('returns a function', () => {
      expect(typeof setDefaultCategory()).toBe('function')
    })

    describe('when not logged in', () => {

      let isLoggedInSpy

      beforeEach(() => {
        isLoggedInSpy = jest.spyOn(bigTime, 'isLoggedIn').mockImplementation(() => false)
      })

      afterEach(() => {
        isLoggedInSpy.mockRestore()
      })

      it('throws an error', async () => {
        await setDefaultCategory()()
        expect(isLoggedInSpy).toHaveBeenCalled()
        expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Please login before continuing')
      })

    })

    describe('🙂 when logged in', () => {

      let isLoggedInSpy

      beforeEach(() => {
        isLoggedInSpy = jest.spyOn(bigTime, 'isLoggedIn').mockImplementation(() => true)
      })

      afterEach(() => {
        isLoggedInSpy.mockRestore()
      })

      describe('when fetching categories is unsuccessful', () => {

        let laborCodesPicklistSpy

        beforeEach(() => {
          laborCodesPicklistSpy = jest.spyOn(bigTime, 'laborCodesPicklist').mockImplementation(() => {
            throw new Error('foo')
          })
        })

        afterEach(() => {
          laborCodesPicklistSpy.mockRestore()
        })

        it('displays an error message', async () => {
          const context = {}
          const progress = {
            report: jest.fn()
          }
          vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
            cb(progress)
          })
          await setDefaultCategory(context)()
          expect(isLoggedInSpy).toHaveBeenCalled()
          expect(vscode.window.withProgress).toHaveBeenCalledWith({
            location: 1
          }, expect.anything())
          expect(progress.report).toHaveBeenCalledWith({message: 'Fetching categories...'})
          expect(laborCodesPicklistSpy).toHaveBeenCalled()
          expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('foo')
        })

      })

      describe('🙂 when fetching categories is successful', () => {

        let laborCodesPicklistSpy

        beforeEach(() => {
          laborCodesPicklistSpy = jest.spyOn(bigTime, 'laborCodesPicklist').mockImplementation(() => {})
        })

        afterEach(() => {
          laborCodesPicklistSpy.mockRestore()
        })

        describe('when a category is not provided', () => {

          it('returns', async () => {
            const context = {}
            const progress = {
              report: jest.fn()
            }
            const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
            const arraySpliceSpy = jest.spyOn(Array.prototype, 'splice')
            vscode.window.showQuickPick = jest.fn().mockImplementation(() => {
              return Promise.resolve(undefined)
            })
            vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
              cb(progress)
              return {
                body: [
                  {
                    Id: 1,
                    Group: 'Group 1',
                    Name: 'Name 1'
                  },
                  {
                    Id: 2,
                    Name: 'Name 2'
                  }
                ]
              }
            })
            await setDefaultCategory(context)()
            expect(isLoggedInSpy).toHaveBeenCalled()
            expect(vscode.window.withProgress).toHaveBeenCalledWith({location: 1}, expect.anything())
            expect(progress.report).toHaveBeenCalledWith({message: 'Fetching categories...'})
            expect(laborCodesPicklistSpy).toHaveBeenCalled()
            expect(arrayMapSpy).toHaveBeenCalled()
            expect(arraySpliceSpy).toHaveBeenCalledWith(0, 0, {label: '(Unset)', value: 'unset'})
            expect(vscode.window.showQuickPick).toHaveBeenCalledWith([
              {label: '(Unset)', value: 'unset'},
              {label: 'Group 1 - Name 1', value: 1},
              {label: 'Name 2', value: 2},
            ])
          })

        })

        describe('🙂 when the category is \'unset\'', () => {

          it('🙂 unsets the global state and shows an informational message', async () => {
            const context = {
              globalState: {
                update: jest.fn()
              }
            }
            const progress = {
              report: jest.fn()
            }
            const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
            const arraySpliceSpy = jest.spyOn(Array.prototype, 'splice')
            vscode.window.showQuickPick = jest.fn().mockImplementation(() => {
              return Promise.resolve({
                label: '(Unset)',
                value: 'unset'
              })
            })
            vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
              cb(progress)
              return {
                body: [
                  {
                    Id: 1,
                    Group: 'Group 1',
                    Name: 'Name 1'
                  },
                  {
                    Id: 2,
                    Name: 'Name 2'
                  }
                ]
              }
            })
            await setDefaultCategory(context)()
            expect(isLoggedInSpy).toHaveBeenCalled()
            expect(vscode.window.withProgress).toHaveBeenCalledWith({location: 1}, expect.anything())
            expect(progress.report).toHaveBeenCalledWith({message: 'Fetching categories...'})
            expect(laborCodesPicklistSpy).toHaveBeenCalled()
            expect(arrayMapSpy).toHaveBeenCalled()
            expect(arraySpliceSpy).toHaveBeenCalledWith(0, 0, {label: '(Unset)', value: 'unset'})
            expect(vscode.window.showQuickPick).toHaveBeenCalledWith([
              {label: '(Unset)', value: 'unset'},
              {label: 'Group 1 - Name 1', value: 1},
              {label: 'Name 2', value: 2},
            ])
            expect(context.globalState.update).toHaveBeenCalledWith('defaultCategory', '')
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Successfully unset default category')
          })

        })

        describe('🙂 when a category is provided', () => {

          it('🙂 updates the global state and shows an informational message', async () => {
            const context = {
              globalState: {
                update: jest.fn()
              }
            }
            const progress = {
              report: jest.fn()
            }
            const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
            const arraySpliceSpy = jest.spyOn(Array.prototype, 'splice')
            vscode.window.showQuickPick = jest.fn().mockImplementation(() => {
              return Promise.resolve({
                label: 'Group 1 - Name 1',
                value: 1
              })
            })
            vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
              cb(progress)
              return {
                body: [
                  {
                    Id: 1,
                    Group: 'Group 1',
                    Name: 'Name 1'
                  },
                  {
                    Id: 2,
                    Name: 'Name 2'
                  }
                ]
              }
            })
            await setDefaultCategory(context)()
            expect(isLoggedInSpy).toHaveBeenCalled()
            expect(vscode.window.withProgress).toHaveBeenCalledWith({location: 1}, expect.anything())
            expect(progress.report).toHaveBeenCalledWith({message: 'Fetching categories...'})
            expect(laborCodesPicklistSpy).toHaveBeenCalled()
            expect(arrayMapSpy).toHaveBeenCalled()
            expect(arraySpliceSpy).toHaveBeenCalledWith(0, 0, {label: '(Unset)', value: 'unset'})
            expect(vscode.window.showQuickPick).toHaveBeenCalledWith([
              {label: '(Unset)', value: 'unset'},
              {label: 'Group 1 - Name 1', value: 1},
              {label: 'Name 2', value: 2},
            ])
            expect(context.globalState.update).toHaveBeenCalledWith('defaultCategory', {label: 'Group 1 - Name 1', value: 1})
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Successfully set default category to Group 1 - Name 1')
          })

        })

      })

    })

  })

})
