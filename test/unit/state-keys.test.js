const stateKeys = require('../../state-keys')

describe('State keys', () => {

  it('exports an object', () => {
    expect(typeof stateKeys).toBe('object')
    expect(stateKeys).toHaveProperty('DEFAULT_PROJECT')
    expect(stateKeys).toHaveProperty('DEFAULT_CATEGORY')
    expect(stateKeys).toHaveProperty('DEFAULT_HOURS')
    expect(stateKeys.DEFAULT_PROJECT).toBe('defaultProject')
    expect(stateKeys.DEFAULT_CATEGORY).toBe('defaultCategory')
    expect(stateKeys.DEFAULT_HOURS).toBe('defaultHours')
  })

})
