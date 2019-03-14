/**
 * @module commands/log-time
 */

const vscode = require('vscode')
const moment = require('moment')

const bigTime = require('../bigtime')
const { NotLoggedInError } = require('../errors')
const {
  DEFAULT_PROJECT,
  DEFAULT_CATEGORY,
  DEFAULT_HOURS
} = require('../state-keys')

/**
 * If the user is logged in, this will:
 *
 * 1.  Fetch projects.
 * 2.  Transform the BigTime API response into a VS Code QuickPick-friendly
 *     format.
 * 3a. If a default project has been set and exists in the API response,
 *     skip to 4.
 * 3b. If a default project has not been set or the default does not
 *     exist in the API response, prompt the user to choose one.
 * 4.  Fetch categories (aka, labor codes).
 * 5.  Transform the BigTime API response into a VS Code QuickPick-friendly
 *     format.
 * 6a. If a default category has been set and exists in the API response,
 *     skip to 7a.
 * 6b. If a default category has not been set or the default does not
 *     exist in the API response, prompt the user to choose one.
 * 7a. If a default number of hours has been set, skip to 8.
 * 7b. If a default number of house has not been set, prompt the user for
 *     input.
 * 8.  Prompt the user for a date.
 * 9.  Issue a request to BigTime to record the hours. If successful,
 *     will display an informational message, otherwise, an error message.
 *
 * @param {vscode.ExtensionContext} context
 * @return {Function}
 */
function logTime(context) {
  /**
   * @return {Promise<undefined>}
   */
  return async () => {
    try {
      if (!bigTime.isLoggedIn()) throw new NotLoggedInError()

      // Project
      const projectsPicklistResponse = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
      }, progress => {
        progress.report({ message: 'Fetching projects...'})
        return bigTime.projectsPicklist()
      })
      const projects = projectsPicklistResponse.body.map(project => {
        const label = project.Group
          ? `${project.Group} - ${project.Name}`
          : project.Name
        return {
          label,
          value: project.Id
        }
      })
      const defaultProject = context.globalState.get(DEFAULT_PROJECT)
      let project = projects.find(project => project.value === defaultProject.value)
      if (!project) {
        project = await vscode.window.showQuickPick(projects)
      }
      if (project === undefined) {
        return
      }

      // Category
      const categoriesPicklistResponse = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
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
      const defaultCategory = context.globalState.get(DEFAULT_CATEGORY)
      let category = categories.find(category => category.value === defaultCategory.value)
      if (!category) {
        category = await vscode.window.showQuickPick(categories)
      }
      if (category === undefined) {
        return
      }

      // Hours
      const defaultHours = context.globalState.get(DEFAULT_HOURS)
      let hours = defaultHours
      if (!hours) {
        hours = await vscode.window.showInputBox({
          prompt: 'Hours'
        })
      }
      if (hours === undefined) {
        return
      }
      // if (isNaN(hours)) {}

      // Date
      const date = await vscode.window.showInputBox({
        prompt: 'Date',
        value: moment().format('YYYY-MM-DD')
      })
      // const note = await vscode.window.showInputBox()
      // if (!date || !project.value || !category.value || !hours) {
      //   throw new Error()
      // }
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
      }, progress => {
        progress.report({ message: 'Submitting...'})
        return bigTime.createTimeEntry({
          Dt: date,
          ProjectSID: project.value,
          BudgCatID: category.value,
          Hours_IN: hours,
          Notes: 'Created using VS Code'
        })
      })
      vscode.window.showInformationMessage(`Successfully logged ${hours} hours for ${project.label}`)
    } catch (err) {
      vscode.window.showErrorMessage(err.message)
    }
  }
}

module.exports = logTime
