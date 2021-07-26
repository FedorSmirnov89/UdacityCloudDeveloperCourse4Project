

import { TodoItem } from "../models/TodoItem"
import { DbAccess } from "../dataLayer/DbAccess"

const dbAccess = new DbAccess()

export async function getUserTodos(userId: string): Promise<TodoItem[]> {
    return dbAccess.queryTodosUser(userId)
} 