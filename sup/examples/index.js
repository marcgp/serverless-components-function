const SUP = require('../index.js')
const sup = new SUP()

let result
result = sup('dynamodb')
// result = sup('dynamodb?use')
// result = sup('dynamodb?read')
// result = sup('dynamodb?read+write')
// result = sup('dynamodb?read+write+tables=users')
// result = sup('dynamodb?read+write+tables=users+regions=us-east-1')
// result = sup('dynamodb?read+write+tables=users,posts,comments+regions=us-east-1,us-west-2+indexes=test')

console.log()
console.log(result.type)
console.log()
console.log(result.data)
console.log()
console.log(result.data.Statement)
console.log()
