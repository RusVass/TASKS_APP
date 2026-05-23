import type { Todo } from '../../types';
import styles from './TodoItem.module.scss';

interface TodoItemProps {
  todo: Todo;
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoItem({ todo, onComplete, onDelete }: TodoItemProps) {
  return (
    <div className={`${styles.card} ${todo.completed ? styles.completed : ''}`}>
      <button
        type="button"
        className={styles.checkbox}
        onClick={() => onComplete(todo)}
        disabled={todo.completed}
        aria-label={todo.completed ? 'Task completed' : 'Mark as complete'}
        title={todo.completed ? 'Task completed' : 'Mark as complete'}
      >
        {todo.completed ? '✓' : ''}
      </button>

      <div className={styles.content}>
        <p className={styles.text}>{todo.text}</p>
        <span className={styles.badge}>{todo.category}</span>
      </div>

      <button
        type="button"
        className={styles.deleteButton}
        onClick={() => onDelete(todo)}
        aria-label="Delete task"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
}
