export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Other';

export interface Todo {
  id: number;
  text: string;
  category: Category;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoFormValues {
  text: string;
  category: Category | '';
}

export type SnackbarAction =
  | { type: 'complete'; todo: Todo }
  | { type: 'delete'; todo: Todo };

export interface SnackbarState {
  message: string;
  action: SnackbarAction;
}
