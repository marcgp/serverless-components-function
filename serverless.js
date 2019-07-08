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
    this.context.status('Deploying')

    const lambda = await this.load('@serverless/aws-lambda')

    const lambdaOutputs = await lambda(inputs)

    return lambdaOutputs
  }

  /**
   * Remove
   * @param  {Object}  [inputs={}]
   * @return {Promise}
   */

  async remove(inputs = {}) {
    this.context.status('Removing')

    const lambda = await this.load('@serverless/aws-lambda')

    const lambdaOutputs = await lambda.remove(inputs)

    return lambdaOutputs
  }
}

module.exports = Function
