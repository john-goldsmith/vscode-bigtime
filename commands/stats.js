/**
 * @module commands/stats
 */

const vscode = require('vscode')
const moment = require('moment')

const bigTime = require('../bigtime')
const { NotLoggedInError } = require('../errors')

/**
 * If the user is logged in, will attempt to fetch two different time
 * ranges of time entries: one for month-to-date and week-to-date. If
 * successful, this will sum all entries and display an informational
 * message for both ranges.
 *
 * @return {Function}
 */
function stats(/*context*/) {
  /**
   * @return {Promise<undefined>}
   */
  return async () => {
    try {
      if (!bigTime.isLoggedIn()) throw new NotLoggedInError()
      const timeSheetDateRangeMonthResponse = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
      }, progress => {
        progress.report({ message: 'Fetching time entries...'})
        return bigTime.getTimeSheetDateRange({
          StartDt: moment().startOf('month').format('YYYY-MM-DD')
        })
      })
      const monthToDateTotal = timeSheetDateRangeMonthResponse.body.reduce((acc, cur) => acc + Number(cur.Hours_IN), 0)
      const timeSheetDateRangeWeekResponse = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
      }, progress => {
        progress.report({ message: 'Fetching time entries...'})
        return bigTime.getTimeSheetDateRange({
          StartDt: moment().startOf('week').format('YYYY-MM-DD')
        })
      })
      const weekToDateTotal = timeSheetDateRangeWeekResponse.body.reduce((acc, cur) => acc + Number(cur.Hours_IN), 0)
      vscode.window.showInformationMessage(`Month to date: ${monthToDateTotal} hours logged (${timeSheetDateRangeMonthResponse.body.length} entries)`)
      vscode.window.showInformationMessage(`Week to date: ${weekToDateTotal} hours logged (${timeSheetDateRangeWeekResponse.body.length} entries)`)
    } catch (err) {
      vscode.window.showErrorMessage(err.message)
    }
  }
}

module.exports = stats
