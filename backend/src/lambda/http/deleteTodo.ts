import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'

import { getUserFromEvent} from '../../auth/utils'

const logger = createLogger('updateTodo')

const docClient = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserFromEvent(event)

  logger.info('received deletion event', {
    reqBody:JSON.stringify(event.body),
    todoId:todoId
  })

  var params = {
    TableName:tableName,
    Key:{
      todoId:todoId,
      userId: userId
    }
  }

  var status;

  await docClient.delete(params, function(err, data){
    if (err){
      status = 501
      logger.error('Error while deleting todo', {
        todoId: todoId
      })
    }else{
      status = 201
      logger.info('Delete successful', {
        data: data
      })
    }
  }).promise()

  return {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
