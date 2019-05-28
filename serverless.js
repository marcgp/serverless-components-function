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
    this.cli.status('Deploying')

    const lambda = await this.load('@serverless/aws-lambda')

    const lambdaOutputs = await lambda(inputs)

    this.cli.outputs(lambdaOutputs)

    return lambdaOutputs
  }

  /**
   * Remove
   * @param  {Object}  [inputs={}]
   * @return {Promise}
   */

  async remove(inputs = {}) {
    this.cli.status('Removing')

    const lambda = await this.load('@serverless/aws-lambda')

    const lambdaOutputs = await lambda.remove(inputs)

    this.cli.outputs(lambdaOutputs)

    return lambdaOutputs
  }
}

module.exports = Function
