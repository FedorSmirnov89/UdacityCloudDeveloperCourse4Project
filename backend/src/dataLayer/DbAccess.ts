import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from "../models/TodoUpdate"

export class DbAccess{

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
      }

    /**
     * Updates the provided todo with the provided content
     * 
     * @param userId   the user id
     * @param todoId   the todo id
     * @param content  the content for the update
     */  
    async updateTodo(userId: string, todoId: string, content: TodoUpdate){

        var params = {
            TableName: this.todosTable,
            Key:{
              todoId:  todoId,
              userId: userId
            },
            UpdateExpression: "set #replace = :n, dueDate = :d, done = :b",
            ExpressionAttributeValues:{
              ":n":content.name,
              ":d":content.dueDate,
              ":b":content.done
            },
            ExpressionAttributeNames: {
              "#replace": "name"
            },
            ReturnValues:"UPDATED_NEW"
          };        
          await this.docClient.update(params).promise()
    }


    /**
     * Query the table to get all todos of a user
     * 
     * @param userId the given user id
     * 
     * @returns the todos of the given user
     */  
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