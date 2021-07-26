import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from "../models/TodoItem"


export class DbAccess{

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
      }


    async queryTodosUser(userId: string): Promise<TodoItem[]>{
        
        const queryParams = {
            TableName: this.todosTable,
            KeyConditionExpression: "#user = :uid",
            ExpressionAttributeNames:{
              "#user": "userId"
            },
            ExpressionAttributeValues: {
              ":uid": userId
            }
        }

        const todos = await (await this.docClient.query(queryParams).promise()).Items
        return todos as TodoItem[]
    }
}