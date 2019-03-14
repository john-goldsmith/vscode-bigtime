const login = require('./login')
const logout = require('./logout')
const logTime = require('./log-time')
const setDefaultCategory = require('./set-default-category')
const setDefaultProject = require('./set-default-project')
const setDefaultHours = require('./set-default-hours')
const goToWebsite = require('./go-to-website')
const stats = require('./stats')
const getDefaults = require('./get-defaults')

const commandHandlerMapping = new Map([
  ['extension.login', login],
  ['extension.logout', logout],
  ['extension.logTime', logTime],
  ['extension.setDefaultProject', setDefaultProject],
  ['extension.setDefaultCategory', setDefaultCategory],
  ['extension.setDefaultHours', setDefaultHours],
  ['extension.goToWebsite', goToWebsite],
  ['extension.stats', stats],
  ['extension.getDefaults', getDefaults]
])

module.exports = commandHandlerMapping
