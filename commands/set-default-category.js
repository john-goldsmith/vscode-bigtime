/**
 * @module commands/set-default-category
 */

const vscode = require('vscode')

const { DEFAULT_CATEGORY } = require('../state-keys')
const bigTime = require('../bigtime')
const { NotLoggedInError } = require('../errors')

/**
 * If the user is logged in, will attempt to fetch categories (aka, labor
 * codes) from BigTime and display a list for the user to choose from.
 * If the user cancels the operation, no changes will occur. If the user
 * makes a selection, it will be saved as the default category for future
 * usage. A special 'unset' option is injected into the list of options
 * and, if chosen, will clear the default category.
 *
 * @param {vscode.ExtensionContext} context
 * @return {Function}
 */
function setDefaultCategory(context) {
  /**
   * @return {Promise<undefined>}
   */
  return async () => {
    try {
      if (!bigTime.isLoggedIn()) throw new NotLoggedInError()
      const categoriesPicklistResponse = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window
      }, progress => {
        progress.report({ message: 'Fetching categories...'})
        return bigTime.laborCodesPicklist()
      })
      const categories = categoriesPicklistResponse.body.map(category => {
        const label = category.Group
        ? `${category.Group} - ${category.Name}`
        : category.Name
        return {
          label,
          value: category.Id
        }
      })
      categories.splice(0, 0, {label: '(Unset)', value: 'unset'})
      const category = await vscode.window.showQuickPick(categories)
      if (category === undefined) {
        return
      } else if (category.value === 'unset') {
        await context.globalState.update(DEFAULT_CATEGORY, '')
        vscode.window.showInformationMessage('Successfully unset default category')
      } else {
        await context.globalState.update(DEFAULT_CATEGORY, category)
        vscode.window.showInformationMessage(`Successfully set default category to ${category.label}`)
      }
    } catch (err) {
      vscode.window.showErrorMessage(err.message)
    }
  }
}

module.exports = setDefaultCategory
