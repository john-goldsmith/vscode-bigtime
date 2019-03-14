const index = require('../../../commands/index')

describe('Commands', () => {

  describe('index', () => {

    it('exports a mapping of commands and handlers', () => {
      expect(index instanceof Map).toBe(true)
      expect(index.size).toBe(9)
      expect(index.has('extension.login')).toBe(true)
      expect(index.has('extension.logout')).toBe(true)
      expect(index.has('extension.logTime')).toBe(true)
      expect(index.has('extension.setDefaultProject')).toBe(true)
      expect(index.has('extension.setDefaultCategory')).toBe(true)
      expect(index.has('extension.setDefaultHours')).toBe(true)
      expect(index.has('extension.goToWebsite')).toBe(true)
      expect(index.has('extension.stats')).toBe(true)
      expect(index.has('extension.getDefaults')).toBe(true)
      expect(typeof index.get('extension.login')).toBe('function')
      expect(typeof index.get('extension.logout')).toBe('function')
      expect(typeof index.get('extension.logTime')).toBe('function')
      expect(typeof index.get('extension.setDefaultProject')).toBe('function')
      expect(typeof index.get('extension.setDefaultCategory')).toBe('function')
      expect(typeof index.get('extension.setDefaultHours')).toBe('function')
      expect(typeof index.get('extension.goToWebsite')).toBe('function')
      expect(typeof index.get('extension.stats')).toBe('function')
      expect(typeof index.get('extension.getDefaults')).toBe('function')
    })

  })

})