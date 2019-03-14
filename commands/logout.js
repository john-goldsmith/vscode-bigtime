/**
 * @module commands/logout
 */

const vscode = require('vscode')

const bigTime = require('../bigtime')

/**
 * Logs the current user out.
 *
 * @return {Function}
 */
function logout(/*context*/) {
  /**
   * @return {undefined}
   */
  return () => {
    bigTime.sessionToken = null
    bigTime.firm = null
    bigTime.staffSid = null
    bigTime.userId = null
    vscode.window.showInformationMessage('Successfully logged out of BigTime');
  }
}

module.exports = logout
