const accessData = require('./access.json')

/**
 * SUP: DynamoDB
 * @type {[type]}
 */

module.exports = (sup) => {

  // Create AWS ARNs
  const newArn = () => {
    return 'arn:aws:dynamodb:region:account-id:table/table-name/entity/entity-name'
  }

  let arns = []

  // Create ARNs - Regions
  if (!sup.options.regions || !sup.options.regions.length) {
    let arn = newArn()
    arn = arn.replace(':region:', ':*:')
    arns.push(arn)
  } else {
    sup.options.regions.forEach((r) => {
      let arn = newArn()
      arn = arn.replace(':region:', `:${r}:`)
      arns.push(arn)
    })
  }

  // Create ARNs - Accounts
  if (!sup.options.accounts || !sup.options.accounts.length) {
    arns.forEach((arn, i) => { arns[i] = arn.replace(':account-id:', ':*:') })
  } else {
    let newArns = []
    sup.options.accounts.forEach((a) => {
      arns.forEach((arn) => {
        arn = arn.replace(':account-id:', `:${a}:`)
        newArns.push(arn)
      })
    })
    arns = newArns
  }

  // Create ARNs - Tables
  if (!sup.options.tables || !sup.options.tables.length) {
    arns.forEach((arn, i) => { arns[i] = arn.replace(':table/table-name', ':table/*') })
  } else {
    let newArns = []
    sup.options.tables.forEach((t) => {
      arns.forEach((arn) => {
        arn = arn.replace(':table/table-name', `:table/${t}`)
        newArns.push(arn)
      })
    })
    arns = newArns
  }

  // Create ARNs - Entities
  const entities = []
  if (sup.options.backups) {
    sup.options.backups.forEach((val) => entities.push({ key: 'backup', val }))
  }
  if (sup.options.streams) {
    sup.options.streams.forEach((val) => entities.push({ key: 'stream', val }))
  }
  if (sup.options.indexes) {
    sup.options.indexes.forEach((val) => entities.push({ key: 'index', val }))
  }
  if (!entities.length) {
    arns.forEach((arn, i) => { arns[i] = arn.replace('/entity/entity-name', '/*/*') })
  } else {
    let newArns = []
    entities.forEach((e) => {
      arns.forEach((arn) => {
        arn = arn.replace('/entity/entity-name', `/${e.key}/${e.val}`)
        newArns.push(arn)
      })
    })
    arns = newArns
  }

  // Aggregate Actions for each Access Permission
  let permissions = []
  if (sup.options.admin) permissions.push('admin')
  if (sup.options.describe) permissions.push('describe')
  if (sup.options.read) permissions.push('read')
  if (sup.options.write) permissions.push('write')
  if (sup.options.use) permissions.push('use')
  // Default to admin access
  if (!permissions.length) permissions.push('admin')
  // Add IAM Action statements
  let actions = []
  permissions.forEach((permission) => {
    let a = accessData[permission]
    if (!a) return
    actions = actions.concat(a.filter((item) => {
      return permission.indexOf(item) < 0
    }))
  })

  // Create IAM Policy Statements
  let policy = {
    Action: actions,
    Resource: [],
    Effect: 'Allow',
  }

  arns.forEach((arn) => policy.Resource.push(arn))

  let result = {
    type: 'aws-iam-policy',
    data: policy,
  }

  return result
}
