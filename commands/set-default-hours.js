/**
 * @module commands/set-default-hours
 */

const vscode = require('vscode')

const { DEFAULT_HOURS } = require('../state-keys')
const {
  NegativeDefaultHoursError,
  ExceededMaximumHoursError,
  HoursNotANumberError
} = require('../errors')

/**
 * Prompts the user for a default number of hours. If supplied and valid,
 * this value will be saved for future usage. If a blank value is supplied,
 * the default will be cleared. If no value is supplied, no changes will
 * occur. Displays an error message if the value is negative or greater
 * than 24 (since there are only 24 hours in a day). Does not require the
 * user to be logged in since no BigTime API interactions take place.
 *
 * @param {vscode.ExtensionContext} context
 * @return {Function}
 */
function setDefaultHours(context) {
  /**
   * @return {Promise<undefined>}
   */
  return async () => {
    try {
      const hours = await vscode.window.showInputBox({
        prompt: 'Default hours (0 - 24, leave blank to unset)'
      })
      if (hours === undefined) {
        return
      } else if (hours === '') {
        await context.globalState.update(DEFAULT_HOURS, '')
        vscode.window.showInformationMessage('Successfully unset default hours')
        return
      }
      const hoursAsNumber = Number(hours)
      if (hoursAsNumber < 0) throw new NegativeDefaultHoursError()
      if (hoursAsNumber > 24) throw new ExceededMaximumHoursError()
      if (isNaN(hoursAsNumber)) throw new HoursNotANumberError()
      await context.globalState.update(DEFAULT_HOURS, hoursAsNumber)
      vscode.window.showInformationMessage(`Successfully set default hours to ${hoursAsNumber}`)
    } catch (err) {
      vscode.window.showErrorMessage(err.message)
    }
  }
}

module.exports = setDefaultHours
