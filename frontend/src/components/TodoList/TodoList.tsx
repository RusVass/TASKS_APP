import type { Todo } from '../../types';
import { TodoItem } from '../TodoItem/TodoItem';
import styles from './TodoList.module.scss';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoList({ todos, loading, error, onComplete, onDelete }: TodoListProps) {
  if (loading) {
    return (
      <div className={styles.state}>
        <p className={styles.message}>Loading tasks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.state}>
        <p className={`${styles.message} ${styles.error}`}>{error}</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className={styles.state}>
        <p className={styles.message}>No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} onComplete={onComplete} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
