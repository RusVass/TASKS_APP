import api from './axiosInstance';
import type { Todo, Category } from '../types';

export async function fetchTodos(category?: Category): Promise<Todo[]> {
  const params = category ? { category } : {};
  const response = await api.get<{ todos: Todo[] }>('/todos', { params });
  return response.data.todos;
}

export async function createTodo(text: string, category: Category): Promise<Todo> {
  const response = await api.post<Todo>('/todos', { text, category });
  return response.data;
}

export async function updateTodo(id: number, completed: boolean): Promise<Todo> {
  const response = await api.patch<Todo>(`/todos/${id}`, { completed });
  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}
