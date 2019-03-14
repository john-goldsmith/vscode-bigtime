const vscode = require('vscode')

const goToWebsite = require('../../../commands/go-to-website')

describe('Commands', () => {

  describe('goToWebsite', () => {

    it('returns a function', () => {
      expect(typeof goToWebsite()).toBe('function')
    })

    it('🙂 opens an external URI', () => {
      goToWebsite()()
      expect(vscode.Uri).toHaveBeenCalledWith({
        scheme: 'https',
        authority: 'iq.bigtime.net'
      })
      expect(vscode.env.openExternal).toHaveBeenCalled()
    })

  })

})
