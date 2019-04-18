const path = require('path')
const shortid = require('shortid')
const aws = require('aws-sdk')
const { Component } = require('@serverless/components')
const { mergeDeepRight } = require('ramda')
const {
  deployAwsLambda,
  removeAwsLambda,
} = require('./lib')

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

    this.cli.status('Running')

    // Defaults
    const defaults = {}
    defaults.code = `./code/index.handler`
    defaults.description = `A function deployed with Serverless Components`
    defaults.env = {}
    defaults.cors = true

    if (this.state.inputs && this.state.inputs.name) {
      defaults.name = this.state.inputs.name
    } else {
      defaults.name = `function-${shortid.generate().replace(/[_-]/g, '')}`
    }

    // Merge inputs w/ defaults
    inputs = mergeDeepRight(defaults, inputs)

    // Save inputs to state
    this.state.inputs = inputs
    await this.save()

    // Declare Outputs
    let outputs = {}
    outputs.name = inputs.name

    // Deploy
    if (!inputs.compute || !inputs.compute.type || inputs.compute.type === 'aws-lambda') {
      const fnOutputs = await deployAwsLambda(this, inputs)
      outputs = mergeDeepRight(outputs, fnOutputs)
    } else {
      throw new Error(`Sorry compute.type ${inputs.compute.type} is not yet supported.`)
    }

    this.cli.outputs(outputs)

    return outputs
  }

  /**
   * Remove
   * @param  {Object}  [inputs={}]
   * @return {Promise}
   */

  async remove(inputs = {}) {

    // Status
    this.cli.status('Removing')

    // Remove
    let outputs
    if (!inputs.compute || !inputs.compute.type || inputs.compute.type === 'aws-lambda') {
      outputs = await removeAwsLambda(this)
    } else {
      throw new Error(`Sorry compute.type ${inputs.compute.type} is not yet supported.`)
    }

    // Clear state
    this.state = {}
    await this.save()
    return {}
  }
}

module.exports = Function
