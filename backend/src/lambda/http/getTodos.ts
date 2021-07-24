import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS from 'aws-sdk'

import { createLogger } from '../../utils/logger'

import { getUserFromEvent} from '../../auth/utils'

const logger = createLogger('getTodos')

const docClient = new AWS.DynamoDB.DocumentClient()

const tableName = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserFromEvent(event)

  logger.info('Received trigger event', {
    triggerEvent: JSON.parse(event.body)
  }
  )

  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: "#user = :uid",
    ExpressionAttributeNames:{
      "#user": "userId"
    },
    ExpressionAttributeValues: {
      ":uid": userId
    }
  }

  const result = await docClient.query(
    queryParams
  ).promise()

  logger.info('Query successful')

  const items = result.Items

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
