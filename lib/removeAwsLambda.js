/** Remove AWS Lambda
 * @param  {[type]}  component [description]
 * @param  {[type]}  inputs    [description]
 * @return {Promise}           [description]
 */

module.exports = async (component) => {

  // Remove AWS Lambda
  const awsLambda = await component.load('@serverless/aws-lambda')
  const outputsAwsLambda = await awsLambda.remove({
    name: component.state.name
  })

  // Remove AWS IAM Role, if exists
  if (component.state.awsLambda && component.state.awsLambda.awsIamRoleArn) {
    const awsIamRole = await component.load('@serverless/aws-iam-role')
    const outputsAwsIamRole = await awsIamRole.remove({
      arn: component.state.awsLambda.awsIamRoleArn
    })
  }

  // Remove AWS API Gateway
  const awsApiGateway = await component.load('@serverless/aws-api-gateway')
  const outputsAwsApiGateway = await awsApiGateway.remove()

  return {}
}
