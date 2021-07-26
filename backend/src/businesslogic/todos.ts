

import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from "../models/TodoUpdate"
import { DbAccess } from "../dataLayer/DbAccess"
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest"

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