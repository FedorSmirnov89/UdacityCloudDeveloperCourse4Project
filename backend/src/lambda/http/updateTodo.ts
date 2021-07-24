import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'

import { getUserFromEvent} from '../../auth/utils'

const logger = createLogger('updateTodo')

const docClient = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserFromEvent(event)

  logger.info('Update event received', {
    id: todoId,
    user: userId,
    update: updatedTodo
  })

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  var params = {
    TableName: tableName,
    Key:{
      todoId:  todoId,
      userId: userId
    },
    UpdateExpression: "set #replace = :n, dueDate = :d, done = :b",
    ExpressionAttributeValues:{
      ":n":updatedTodo.name,
      ":d":updatedTodo.dueDate,
      ":b":updatedTodo.done
    },
    ExpressionAttributeNames: {
      "#replace": "name"
    },
    ReturnValues:"UPDATED_NEW"
  };

  await docClient.update(params).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
