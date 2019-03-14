/**
 * @module commands/set-default-project
 */

const vscode = require('vscode')

const { DEFAULT_PROJECT } = require('../state-keys')
const bigTime = require('../bigtime')
const { NotLoggedInError } = require('../errors')

/**
 * If the user is logged in, will attempt to fetch projects from BigTime
 * and display a list for the user to choose from. If the user cancels
 * the operation, no changes will occur. If the user makes a selection,
 * it will be saved as the default project for future usage. A special
 * 'unset' option is injected into the list of options and, if chosen,
 * will clear the default category.
 *
 * @param {vscode.ExtensionContext} context
 * @return {Function}
 */
function setDefaultProject(context) {
  /**
   * @return {Promise<undefined>}
   */
  return async () => {
      try {
        if (!bigTime.isLoggedIn()) throw new NotLoggedInError()
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
        projects.splice(0, 0, {label: '(Unset)', value: 'unset'})
        const project = await vscode.window.showQuickPick(projects)
        if (project === undefined) {
          return
        } else if (project.value === 'unset') {
          await context.globalState.update(DEFAULT_PROJECT, '')
          vscode.window.showInformationMessage(`Successfully unset default project`)
        } else {
          await context.globalState.update(DEFAULT_PROJECT, project)
          vscode.window.showInformationMessage(`Successfully set default project to ${project.label}`)
        }
      } catch (err) {
        vscode.window.showErrorMessage(err.message)
      }
  }
}

module.exports = setDefaultProject
