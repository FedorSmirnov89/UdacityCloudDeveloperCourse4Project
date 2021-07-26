import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'


import { createLogger } from '../../utils/logger'

import { getUserFromEvent} from '../../auth/utils'
import { updateTodo } from "../../businesslogic/todos"

const logger = createLogger('updateTodo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserFromEvent(event)

  logger.info('Update event received', {
    id: todoId,
    user: userId,
    update: updatedTodo
  })

  await updateTodo(userId, todoId, updatedTodo)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
