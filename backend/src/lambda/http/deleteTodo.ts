import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'

import { getUserFromEvent} from '../../auth/utils'
import { deleteTodo } from '../../businesslogic/todos'

const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserFromEvent(event)

  logger.info('received deletion event', {
    reqBody:JSON.stringify(event.body),
    todoId:todoId
  })

  await deleteTodo(userId, todoId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
