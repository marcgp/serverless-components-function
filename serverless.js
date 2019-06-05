const { Component } = require('@serverless/components')

/**
 * Function Component
 * @extends Component
 */

class Function extends Component {
  /**
   * Default
   * @param  {Object}  [inputs={}]
   * @return {Promise}
   */

  async default(inputs = {}) {
    this.ui.status('Deploying')

    const lambda = await this.load('@serverless/aws-lambda')

    const lambdaOutputs = await lambda(inputs)

    this.ui.log()
    this.ui.output('name', `       ${lambdaOutputs.name}`)
    this.ui.output('description', `${lambdaOutputs.description}`)
    this.ui.output('memory', `     ${lambdaOutputs.memory}`)
    this.ui.output('timeout', `    ${lambdaOutputs.timeout}`)
    this.ui.output('id', `         ${lambdaOutputs.arn}`)

    return lambdaOutputs
  }

  /**
   * Remove
   * @param  {Object}  [inputs={}]
   * @return {Promise}
   */

  async remove(inputs = {}) {
    this.ui.status('Removing')

    const lambda = await this.load('@serverless/aws-lambda')

    const lambdaOutputs = await lambda.remove(inputs)

    return lambdaOutputs
  }
}

module.exports = Function
