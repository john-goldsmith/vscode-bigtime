/**
 * @module commands/go-to-website
 */

const vscode = require('vscode')

/**
 * Opens the BigTime website in the user's default browser.
 *
 * @return {Function}
 */
function goToWebsite(/*context*/) {
  /**
   * @return {undefined}
   * @see https://code.visualstudio.com/api/references/vscode-api#Uri
   */
  return () => {
    const uri = new vscode.Uri({
      scheme: 'https',
      authority: 'iq.bigtime.net'
    })
    vscode.env.openExternal(uri)
  }
}

module.exports = goToWebsite
