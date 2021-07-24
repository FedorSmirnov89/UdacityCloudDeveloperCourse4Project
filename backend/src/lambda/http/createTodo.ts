import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createLogger } from '../../utils/logger'

import { getUserFromEvent } from '../../auth/utils'


const logger = createLogger('createTodo')

const docClient = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.TODOS_TABLE
const bucketName = process.env.IMAGE_BUCKET


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  
  const userId = getUserFromEvent(event)
  logger.info('Trigger event received', {        
    user: userId
  })

  const item = {
    todoId: todoId,
    userId: userId,
    attachmentUrl: attachmentUrl,
    ...parsedBody
  }

  await docClient.put({
    TableName: tableName,
    Item: item
  }).promise()

  logger.info('New entry written to data base')
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
