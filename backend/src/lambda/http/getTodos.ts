import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'

import { getUserFromEvent } from '../../auth/utils'

import { getUserTodos } from "../../businesslogic/todos"

const logger = createLogger('getTodos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserFromEvent(event)

  logger.info('Received trigger event', {
    triggerEvent: JSON.parse(event.body)
  }
  )


  const items = await getUserTodos(userId)

  logger.info('Query successful')

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
