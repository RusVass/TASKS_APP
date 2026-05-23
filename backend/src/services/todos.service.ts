import db from '../db/database';
import { Todo, TodoRow, CreateTodoInput, UpdateTodoInput, MAX_TODOS_PER_CATEGORY } from '../types';

// SQLite returns completed as 0 or 1 — convert to boolean for the frontend
function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    text: row.text,
    category: row.category,
    completed: row.completed === 1,
    createdAt: row.createdAt,
  };
}

export function getTodos(category?: string): Todo[] {
  if (category) {
    const rows = db
      .prepare('SELECT * FROM todos WHERE category = ? ORDER BY createdAt DESC')
      .all(category) as TodoRow[];
    return rows.map(rowToTodo);
  }

  const rows = db
    .prepare('SELECT * FROM todos ORDER BY createdAt DESC')
    .all() as TodoRow[];
  return rows.map(rowToTodo);
}

function getTodoById(id: number): Todo | null {
  const row = db
    .prepare('SELECT * FROM todos WHERE id = ?')
    .get(id) as TodoRow | undefined;
  return row ? rowToTodo(row) : null;
}

// Enforces the 5-active-tasks-per-category limit before inserting
export function createTodo(input: CreateTodoInput): Todo {
  const { text, category } = input;

  // Count only active (non-completed) todos for this category
  const countRow = db
    .prepare('SELECT COUNT(*) as count FROM todos WHERE category = ? AND completed = 0')
    .get(category) as { count: number };

  if (countRow.count >= MAX_TODOS_PER_CATEGORY) {
    throw new CategoryLimitError(category);
  }

  const result = db
    .prepare('INSERT INTO todos (text, category) VALUES (?, ?)')
    .run(text, category);

  const newTodo = getTodoById(result.lastInsertRowid as number);
  if (!newTodo) throw new Error('Failed to retrieve created todo');

  return newTodo;
}

export function updateTodo(id: number, input: UpdateTodoInput): Todo {
  const existing = getTodoById(id);
  if (!existing) throw new NotFoundError('Todo not found');

  db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(
    input.completed ? 1 : 0,
    id
  );

  return { ...existing, completed: input.completed };
}

export function deleteTodo(id: number): void {
  const existing = getTodoById(id);
  if (!existing) throw new NotFoundError('Todo not found');

  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class CategoryLimitError extends Error {
  constructor(category: string) {
    super(`Category "${category}" already has ${MAX_TODOS_PER_CATEGORY} active tasks`);
    this.name = 'CategoryLimitError';
  }
}
