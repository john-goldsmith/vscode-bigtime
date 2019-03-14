const BigTime = require('bigtime-sdk')

const bigTime = require('../../bigtime')

describe('BigTime client', () => {

  it('is an instance of the BigTime class', () => {
    expect(bigTime.prototype instanceof BigTime)
  })

})
