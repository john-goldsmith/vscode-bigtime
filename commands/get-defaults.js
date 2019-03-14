/**
 * @module commands/get-defaults
 */

const vscode = require('vscode')

const {
  DEFAULT_PROJECT,
  DEFAULT_CATEGORY,
  DEFAULT_HOURS
} = require('../state-keys')

/**
 * Gets the currently configured defaults (project, category, and hours)
 * and displays each of them in an informational message.
 *
 * @param {vscode.ExtensionContext} context
 * @return {Function}
 * @see https://code.visualstudio.com/api/references/vscode-api#ExtensionContext
 */
function getDefaults(context) {
  /**
   * @return {undefined}
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#Memento
   * @see https://code.visualstudio.com/api/references/vscode-api#window
   */
  return () => {
    const defaultProject = context.globalState.get(DEFAULT_PROJECT)
    const defaultCategory = context.globalState.get(DEFAULT_CATEGORY)
    const defaultHours = context.globalState.get(DEFAULT_HOURS);
    (!!defaultProject)
      ? vscode.window.showInformationMessage(`Default project: ${defaultProject.label}`)
      : vscode.window.showInformationMessage(`Default project not set`);
    (!!defaultCategory)
      ? vscode.window.showInformationMessage(`Default category: ${defaultCategory.label}`)
      : vscode.window.showInformationMessage(`Default category not set`);
    (defaultHours !== '')
      ? vscode.window.showInformationMessage(`Default hours: ${defaultHours}`)
      : vscode.window.showInformationMessage(`Default hours not set`)
  }
}

module.exports = getDefaults
