import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGE_BUCKET
const urlExpiration = process.env.URL_EXPIRE

const logger = createLogger('updateTodo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Received URL event', {
    reqBody:JSON.stringify(event.body)
  })

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: Number(urlExpiration) 
  })
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  } 
}
