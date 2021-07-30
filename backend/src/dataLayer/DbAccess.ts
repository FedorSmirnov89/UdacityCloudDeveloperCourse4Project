import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from "../models/TodoUpdate"
import { CreateTodoRequest} from '../requests/CreateTodoRequest'

const AWSXRay = require('aws-xray-sdk')

export class DbAccess {

  constructor(    
    
    private readonly docClient: DocumentClient = new (AWSXRay.captureAWS(AWS)).DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly imagesBucket =  process.env.IMAGE_BUCKET){
  }

  /**
   * Creates a todo according to the provided arguments
   * 
   * @param userId  the user id
   * @param todoId  the todo id
   * @param createRequest the todo content
   */
  async createTodo(userId: string, todoId: string, createRequest: CreateTodoRequest): Promise<TodoItem>{
    const attachmentUrl = `https://${this.imagesBucket}.s3.amazonaws.com/${todoId}`
    const item = {
      todoId: todoId,
      userId: userId,
      attachmentUrl: attachmentUrl,
      ...createRequest
    }
    await this.docClient.put({
      TableName: this.todosTable,
      Item: item
    }).promise()
    return item as TodoItem
  }

  /**
   * Deletes the todo
   * 
   * @param userId the user id
   * @param todoId the todo id
   */
  async deleteTodo(userId: string, todoId: string) {

    var params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }
    await this.docClient.delete(params).promise()
  }

  /**
   * Updates the provided todo with the provided content
   * 
   * @param userId   the user id
   * @param todoId   the todo id
   * @param content  the content for the update
   */
  async updateTodo(userId: string, todoId: string, content: TodoUpdate) {

    var params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: "set #replace = :n, dueDate = :d, done = :b",
      ExpressionAttributeValues: {
        ":n": content.name,
        ":d": content.dueDate,
        ":b": content.done
      },
      ExpressionAttributeNames: {
        "#replace": "name"
      },
      ReturnValues: "UPDATED_NEW"
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
  async queryTodosUser(userId: string): Promise<TodoItem[]> {

    const queryParams = {
      TableName: this.todosTable,
      KeyConditionExpression: "#user = :uid",
      ExpressionAttributeNames: {
        "#user": "userId"
      },
      ExpressionAttributeValues: {
        ":uid": userId
      }
    }

    const todos = (await this.docClient.query(queryParams).promise()).Items
    return todos as TodoItem[]
  }
}