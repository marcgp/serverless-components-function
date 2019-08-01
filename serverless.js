const { Component } = require('@serverless/core')

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

    const bucket = await this.load('@serverless/aws-s3')
    const lambda = await this.load('@serverless/aws-lambda')

    this.context.status('Deploying AWS S3 Bucket')
    const bucketOutputs = await bucket({
      region: inputs.region
    })

    inputs.bucket = bucketOutputs.name
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

    const bucket = await this.load('@serverless/aws-s3')
    const lambda = await this.load('@serverless/aws-lambda')

    await bucket.remove()
    const lambdaOutputs = await lambda.remove(inputs)

    return lambdaOutputs
  }
}

module.exports = Function
