const path = require('path')
const { mergeDeepRight } = require('ramda')
const SUP = require('../sup')

/**
 * Deploy AWS Lambda
 * @param  {[type]}  component [description]
 * @param  {[type]}  inputs    [description]
 * @return {Promise}           [description]
 */

module.exports = async (component, inputs) => {

  const outputs = {}
  component.state.awsLambda = {}

  // Set defaults
  inputs.compute = inputs.compute || {}
  inputs.compute.policy = inputs.compute.policy || null

  /**
   * Deploy IAM Role (if "permissions" is used)
   * @type {Object}
   */

  if (inputs.permissions) {
    const sup = new SUP()
    let policy = sup(inputs.permissions).awsIamPolicy

    const inputsAwsIamRole = {
      name: inputs.name + '-role',
      service: 'lambda.amazonaws.com',
      policy: policy,
      region: 'us-east-1'
    }

    const awsIamRole = await component.load('@serverless/aws-iam-role')
    const outputsAwsIamRole = await awsIamRole(inputsAwsIamRole)
    inputs.compute.role = outputsAwsIamRole

    component.state.awsLambda.awsIamRoleName = outputsAwsIamRole.name
    component.state.awsLambda.awsIamRoleArn = outputsAwsIamRole.arn
    await component.save()
  }

  /**
   * Deploy Lambda
   */

  const inputsAwsLambda = {
    name: inputs.name,
    description: inputs.description,
    memory: inputs.compute.memory || 512,
    timeout: inputs.compute.timeout || 10,
    code: path.parse(inputs.code).dir,
    bucket: inputs.compute.bucket || null,
    shims: inputs.compute.shims || [],
    handler: path.basename(inputs.code),
    runtime: inputs.compute.runtime || 'nodejs8.10',
    env: inputs.env || {},
    region: inputs.compute.region || 'us-east-1',
    role: inputs.compute.role || null,
  }

  const awsLambda = await component.load('@serverless/aws-lambda')
  const outputsAwsLambda = await awsLambda(inputsAwsLambda)

  // Save state
  component.state.awsLambda.awsLambdaArn = outputsAwsLambda.arn
  component.state.awsLambda.awsLambdaRegion = outputsAwsLambda.region
  await component.save()

  // If no path is submitted, skip deploying API Gateway.
  if (!inputs.path || !inputs.method) return outputs

  /**
   * Deploy API Gateway
   */

  const inputsAwsApiGateway = {
   name: `${inputs.name}-api`,
   region: inputs.compute.region || 'us-east-1',
   routes: {}
  }
  inputsAwsApiGateway.routes[inputs.path] = {}
  inputsAwsApiGateway.routes[inputs.path][inputs.method] = {}
  inputsAwsApiGateway.routes[inputs.path][inputs.method].function = outputsAwsLambda.arn
  inputsAwsApiGateway.routes[inputs.path][inputs.method].cors = inputs.cors

  const awsApiGateway = await component.load('@serverless/aws-api-gateway')
  const outputsAwsApiGateway = await awsApiGateway(inputsAwsApiGateway)

  if (inputs.path.charAt(0) === '/') {
    inputs.path = inputs.path.substr(1)
  }

  // Save state
  component.state.awsLambda.awsApiGatewayName = outputsAwsApiGateway.name
  component.state.awsLambda.awsApiGatewayArn = outputsAwsApiGateway.arn
  component.state.awsLambda.awsApiGatewayId = outputsAwsApiGateway.id
  component.state.awsLambda.awsApiGatewayRoleName = outputsAwsApiGateway.role.name
  component.state.url = outputsAwsApiGateway.url + inputs.path
  component.state.method = inputs.method
  await component.save()

  outputs.url = outputsAwsApiGateway.url + inputs.path
  outputs.method = inputs.method

  return outputs
}
