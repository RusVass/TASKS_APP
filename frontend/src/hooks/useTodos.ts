import { useState, useEffect, useCallback, useRef } from 'react';
import type { Todo, Category } from '../types';
import {
  fetchTodos,
  createTodo as apiCreate,
  updateTodo as apiUpdate,
  deleteTodo as apiDelete,
} from '../api/todos.api';
import { useSnackbar, SNACKBAR_DURATION_MS } from './useSnackbar';
import { getErrorMessage } from '../utils/getErrorMessage';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  formError: string | null;
  activeCategory: Category | null;
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  setActiveCategory: (category: Category | null) => void;
  addTodo: (text: string, category: Category) => Promise<boolean>;
  completeTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
  undoAction: () => void;
  dismissSnackbar: () => void;
  clearFormError: () => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const { snackbar, showSnackbar, dismissSnackbar } = useSnackbar();

  // Holds the pending delete API call so Undo can cancel it
  const pendingDeleteRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Snapshot of the todo being deleted — needed to restore it on Undo
  const pendingDeleteTodoRef = useRef<Todo | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchTodos(activeCategory ?? undefined)
      .then(setTodos)
      .catch(() => setError('Failed to load todos. Please try again.'))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  // Returns true on success so the form can reset
  const addTodo = useCallback(
    async (text: string, category: Category): Promise<boolean> => {
      setFormError(null);
      try {
        const newTodo = await apiCreate(text, category);
        // Only add to visible list if it matches the active category filter
        if (!activeCategory || newTodo.category === activeCategory) {
          setTodos((prev) => [newTodo, ...prev]);
        }
        return true;
      } catch (err) {
        setFormError(getErrorMessage(err));
        return false;
      }
    },
    [activeCategory]
  );

  const completeTodo = useCallback(
    (todo: Todo) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, completed: true } : t))
      );

      apiUpdate(todo.id, true).catch(() => {
        setTodos((prev) =>
          prev.map((t) => (t.id === todo.id ? { ...t, completed: false } : t))
        );
        setError('Failed to complete todo.');
      });

      // After 5s: remove from UI and delete from backend.
      // Undo (via dismissSnackbar) clears the timer so neither happens.
      showSnackbar(`"${todo.text}" marked as complete`, { type: 'complete', todo }, () => {
        setTodos((prev) => prev.filter((t) => t.id !== todo.id));
        apiDelete(todo.id).catch(() => {
          setError('Failed to remove completed todo.');
        });
      });
    },
    [showSnackbar]
  );

  // The DELETE call is deferred by 5s so Undo can cancel it.
  // On Undo the todo is restored locally — no API call needed.
  const deleteTodo = useCallback(
    (todo: Todo) => {
      // A second delete before the first timer expires would silently drop the first API call.
      // Flush it immediately so no deletion is lost.
      if (pendingDeleteRef.current && pendingDeleteTodoRef.current) {
        clearTimeout(pendingDeleteRef.current);
        apiDelete(pendingDeleteTodoRef.current.id).catch(() => {});
        pendingDeleteRef.current = null;
      }

      pendingDeleteTodoRef.current = todo;
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));

      pendingDeleteRef.current = setTimeout(() => {
        pendingDeleteRef.current = null;
        pendingDeleteTodoRef.current = null;
        apiDelete(todo.id).catch(() => {
          setTodos((prev) => [todo, ...prev]);
          setError('Failed to delete todo.');
        });
      }, SNACKBAR_DURATION_MS);

      // onExpire is a no-op here; the timer above owns the actual deletion
      showSnackbar(`"${todo.text}" deleted`, { type: 'delete', todo }, () => {});
    },
    [showSnackbar]
  );

  const undoAction = useCallback(() => {
    if (!snackbar) return;
    const { action } = snackbar;

    if (action.type === 'complete') {
      setTodos((prev) =>
        prev.map((t) => (t.id === action.todo.id ? { ...t, completed: false } : t))
      );
      apiUpdate(action.todo.id, false).catch(() => {
        setError('Failed to undo complete.');
      });
    }

    if (action.type === 'delete') {
      if (pendingDeleteRef.current) {
        clearTimeout(pendingDeleteRef.current);
        pendingDeleteRef.current = null;
      }
      const restored = pendingDeleteTodoRef.current ?? action.todo;
      pendingDeleteTodoRef.current = null;
      setTodos((prev) => [restored, ...prev]);
    }

    dismissSnackbar();
  }, [snackbar, dismissSnackbar]);

  const clearFormError = useCallback(() => setFormError(null), []);

  return {
    todos,
    loading,
    error,
    formError,
    activeCategory,
    snackbar,
    setActiveCategory,
    addTodo,
    completeTodo,
    deleteTodo,
    undoAction,
    dismissSnackbar,
    clearFormError,
  };
}
