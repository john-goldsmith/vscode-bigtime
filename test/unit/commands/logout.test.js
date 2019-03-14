jest.mock('../../../bigtime', () => {
  return {
    sessionToken: 'sessionToken',
    firm: 'firm',
    staffSid: 'staffSid',
    userId: 'userId'
  }
})

const vscode = require('vscode')

const bigTime = require('../../../bigtime')
const logout = require('../../../commands/logout')

describe('Commands', () => {

  describe('logout', () => {

    it('returns a function', () => {
      expect(typeof logout()).toBe('function')
    })

    it('shows an informational message', () => {
      logout()()
      expect(bigTime.sessionToken).toBe(null)
      expect(bigTime.firm).toBe(null)
      expect(bigTime.staffSid).toBe(null)
      expect(bigTime.userId).toBe(null)
      expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Successfully logged out of BigTime')
    })

  })

})
