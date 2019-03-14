const vscode = require('vscode')
const moment = require('moment')

const bigTime = require('../../../bigtime')
const stats = require('../../../commands/stats')

describe('Commands', () => {

  describe('stats', () => {

    it('returns a function', () => {
      expect(typeof stats()).toBe('function')
    })

    describe('when not logged in', () => {

      let isLoggedInSpy

      beforeEach(() => {
        isLoggedInSpy = jest.spyOn(bigTime, 'isLoggedIn').mockImplementation(() => false)
      })

      afterEach(() => {
        isLoggedInSpy.mockRestore()
      })

      it('displays an error message', async () => {
        await stats()()
        expect(isLoggedInSpy).toHaveBeenCalled()
        expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
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

      describe('when fetching time entries is unsuccessful', () => {

        let getTimeSheetDateRangeSpy

        beforeEach(() => {
          getTimeSheetDateRangeSpy = jest.spyOn(bigTime, 'getTimeSheetDateRange').mockImplementation(() => {
            throw new Error('foo')
          })
        })

        afterEach(() => {
          getTimeSheetDateRangeSpy.mockRestore()
        })

        it('shows an error message', async () => {
          const progress = {
            report: jest.fn()
          }
          vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
            cb(progress)
          })
          await stats()()
          expect(isLoggedInSpy).toHaveBeenCalled()
          expect(vscode.window.withProgress).toHaveBeenCalledWith({
            location: 1
          }, expect.anything())
          expect(progress.report).toHaveBeenCalledWith({message: 'Fetching time entries...'})
          expect(getTimeSheetDateRangeSpy).toHaveBeenCalled()
          expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('foo')
        })

      })

      describe('🙂 when fetching time entries is successful', () => {

        let getTimeSheetDateRangeSpy

        beforeEach(() => {
          getTimeSheetDateRangeSpy = jest.spyOn(bigTime, 'getTimeSheetDateRange').mockImplementation(() => {})
        })

        afterEach(() => {
          getTimeSheetDateRangeSpy.mockRestore()
        })

        it('🙂 shows two informational messages', async () => {
          const progress = {
            report: jest.fn()
          }
          vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
            cb(progress)
            return {
              body: [
                {
                  Hours_IN: 8
                },
                {
                  Hours_IN: 8.5
                }
              ]
            }
          })
          const arrayReduceSpy = jest.spyOn(Array.prototype, 'reduce')//.mockImplementation(() => 40)
          await stats()()
          expect(isLoggedInSpy).toHaveBeenCalled()
          expect(vscode.window.withProgress).toHaveBeenCalledWith({
            location: 1
          }, expect.anything())
          expect(progress.report).toHaveBeenCalledWith({message: 'Fetching time entries...'})
          expect(getTimeSheetDateRangeSpy).toHaveBeenCalledWith({StartDt: '2019-12-31'})
          expect(arrayReduceSpy).toHaveBeenCalledWith(expect.anything(), 0)
          expect(progress.report).toHaveBeenCalledWith({message: 'Fetching time entries...'})
          expect(getTimeSheetDateRangeSpy).toHaveBeenCalledWith({StartDt: '2019-12-31'})
          expect(arrayReduceSpy).toHaveBeenCalledWith(expect.anything(), 0)
          expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Month to date: 16.5 hours logged (2 entries)')
          expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Week to date: 16.5 hours logged (2 entries)')
        })

      })

    })

  })

})
