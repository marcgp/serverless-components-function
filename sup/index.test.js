const SUP = require('./index.js');

test('abstraction - dynamodb', () => {
  const sup = new SUP()
  const result = sup('dynamodb')
  expect(result.data.Version).toBeDefined()
  expect(result.data.Statement[0].Action.length).toBe(39)
  expect(result.data.Statement[0].Resource[0]).toBe('arn:aws:dynamodb:*:*:table/*/*/*')
})

test('abstraction - dynamodb', () => {
  const sup = new SUP()
  const result = sup('dynamodb')
  console.log(result)
  console.log(result.data.Statement)
  expect(result.data.Version).toBeDefined()
  expect(result.data.Statement[0].Action.length).toBe(39)
  expect(result.data.Statement[0].Resource[0]).toBe('arn:aws:dynamodb:*:*:table/*/*/*')
})

test('abstraction - dynamodb?read', () => {
  const sup = new SUP()
  const result = sup('dynamodb?read')
  expect(result.data.Version).toBeDefined()
  expect(result.data.Statement[0].Action.length).toBe(4)
  expect(result.data.Statement[0].Resource[0]).toBe('arn:aws:dynamodb:*:*:table/*/*/*')
})

test('abstraction - dynamodb?read+write', () => {
  const sup = new SUP()
  const result = sup('dynamodb?read+write')
  expect(result.data.Version).toBeDefined()
  expect(result.data.Statement[0].Action.length).toBe(8)
  expect(result.data.Statement[0].Resource[0]).toBe('arn:aws:dynamodb:*:*:table/*/*/*')
})

test('abstraction - dynamodb?read+regions=us-east-1', () => {
  const sup = new SUP()
  const result = sup('dynamodb?read+regions=us-east-1')
  expect(result.data.Version).toBeDefined()
  expect(result.data.Statement[0].Action.length).toBe(4)
  expect(result.data.Statement[0].Resource[0]).toBe('arn:aws:dynamodb:us-east-1:*:table/*/*/*')
})

test('abstraction - dynamodb?read+regions=us-east-1,us-west-2', () => {
  const sup = new SUP()
  const result = sup('dynamodb?read+regions=us-east-1,us-west-2')
  expect(result.data.Version).toBeDefined()
  expect(result.data.Statement[0].Action.length).toBe(4)
  expect(result.data.Statement[0].Resource.length).toBe(2)
  expect(result.data.Statement[0].Resource[1]).toBe('arn:aws:dynamodb:us-west-2:*:table/*/*/*')
})

test('abstraction - dynamodb?read+regions=us-east-1,us-west-2', () => {
  const sup = new SUP()
  const result = sup('dynamodb?read+regions=us-east-1,us-west-2')
  expect(result.data.Version).toBeDefined()
  expect(result.data.Statement[0].Action.length).toBe(4)
  expect(result.data.Statement[0].Resource.length).toBe(2)
  expect(result.data.Statement[0].Resource[1]).toBe('arn:aws:dynamodb:us-west-2:*:table/*/*/*')
})

test('abstraction - dynamodb?read+write+regions=us-east-1,us-west-2+tables=users,posts,comments+indexes=test1,test2', () => {
  const sup = new SUP()
  const result = sup('dynamodb?read+write+regions=us-east-1,us-west-2+tables=users,posts,comments+indexes=test1,test2')
  expect(result.data.Version).toBeDefined()
  expect(result.data.Statement[0].Action.length).toBe(8)
  expect(result.data.Statement[0].Resource.length).toBe(12)
  expect(result.data.Statement[0].Resource[11]).toBe('arn:aws:dynamodb:us-west-2:*:table/comments/index/test2')
})
