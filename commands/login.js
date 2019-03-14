/**
 * @module commands/login
 */

const vscode = require('vscode')

const bigTime = require('../bigtime')
const {
  InvalidEmailError,
  InvalidPasswordError
} = require('../errors')

/**
 * Prompts the user for an email and password and, if valid, will
 * authorize the user. If an email or password is not supplied,
 * authorization attempt will not be made. If the supplied credentials
 * are valid, shows an informational message. If the supplied
 * credentials are invalid, shows an error message.
 *
 * @return {Function}
 */
function login(/*context*/) {
  /**
   * @return {Promise<undefined>}
   */
  return async () => {
    try {
      const email = await vscode.window.showInputBox({
        prompt: 'Email'
      })
      if (email === undefined) {
        return
      } else if (email === '') {
        throw new InvalidEmailError()
      }
      const password = await vscode.window.showInputBox({
        prompt: 'Password',
        password: true
      })
      if (password === undefined) {
        return
      } else if (password === '') {
        throw new InvalidPasswordError()
      }
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
      }, progress => {
        progress.report({ message: 'Logging in...'})
        return bigTime.createSession(email, password)
      })
      vscode.window.showInformationMessage('Successfully logged in to BigTime')
    } catch (err) {
      vscode.window.showErrorMessage(err.message)
    }
  }
}

module.exports = login
