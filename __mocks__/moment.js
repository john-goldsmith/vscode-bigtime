module.exports = () => {
 return {
   format: jest.fn(() => {
     return '2019-07-31'
   }),
   startOf: jest.fn(() => {
     return {
       format: jest.fn(() => {
         return '2019-12-31'
       })
     }
   })
 }
}
