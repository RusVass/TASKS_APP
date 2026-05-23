// "as const" lets TypeScript infer the exact string union and allows z.enum() to consume this array directly
export const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Other'] as const;

export type Category = (typeof CATEGORIES)[number];

export const MAX_TODOS_PER_CATEGORY = 5;

export interface TodoRow {
  id: number;
  text: string;
  category: Category;
  completed: number; // SQLite stores booleans as 0 or 1
  createdAt: string;
}

export interface Todo {
  id: number;
  text: string;
  category: Category;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoInput {
  text: string;
  category: Category;
}

export interface UpdateTodoInput {
  completed: boolean;
}
