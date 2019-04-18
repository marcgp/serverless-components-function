const lib = require('./lib')

/**
* SUP Class
*/

class SUP {

  constructor() {
    return this.sup
  }

  /**
  * sup
  * @description Converts SUP statements to vendor-specific syntax.
  * @param statements A SUP statement string or an array of SUP statement strings
  */

  sup(statements) {

    // Validate: Check statement is included
    if (!statements) throw new Error('The "sup" method requires a sup statement argument')

    if (!Array.isArray(statements)) statements = [statements]

    const results = {}
    statements.forEach((s) => {

      // Translate statement
      let result = lib.run(s)

      // Create AWS IAM Policy Statement, if it does not exist.
      if (result.type === 'aws-iam-policy') {
        if (!results.awsIamPolicy) {
          results.awsIamPolicy = {
            Version: '2012-10-17',
            Statement: []
          }
        }

        results.awsIamPolicy.Statement.push(result.data)
      }
    })

    return results
  }
}

module.exports = SUP
