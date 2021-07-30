

import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from "../models/TodoUpdate"
import { DbAccess } from "../dataLayer/DbAccess"
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"

const dbAccess = new DbAccess()

export async function getUserTodos(userId: string): Promise<TodoItem[]> {
    return dbAccess.queryTodosUser(userId)
} 

export async function updateTodo(userId: string, todoId: string, request: UpdateTodoRequest){
    const updateContent : TodoUpdate = {
        name: request.name,
        dueDate: request.dueDate,
        done: request.done
    }

    return dbAccess.updateTodo(userId, todoId, updateContent)
}

export async function deleteTodo(userId: string, todoId: string){
    return dbAccess.deleteTodo(userId, todoId)
}

export async function createTodo(userId: string, todoId: string, createRequest: CreateTodoRequest): Promise<TodoItem>{
    return dbAccess.createTodo(userId, todoId, createRequest)
}