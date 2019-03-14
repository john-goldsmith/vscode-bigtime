const index = require('../../../errors/index')

describe('Errors', () => {

  describe('index', () => {

    it('exports an object', () => {
      expect(typeof index).toBe('object')
      expect(index).toHaveProperty('InvalidPasswordError')
      expect(index).toHaveProperty('InvalidEmailError')
      expect(index).toHaveProperty('NotLoggedInError')
      expect(index).toHaveProperty('NegativeDefaultHoursError')
      expect(index).toHaveProperty('ExceededMaximumHoursError')
      expect(index).toHaveProperty('HoursNotANumberError')
    })

  })

})