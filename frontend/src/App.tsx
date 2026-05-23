import { useTodos } from './hooks/useTodos';
import { useCategories } from './hooks/useCategories';
import { CategoryFilter } from './components/CategoryFilter/CategoryFilter';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { Snackbar } from './components/Snackbar/Snackbar';
import styles from './App.module.scss';

export default function App() {
  const { categories } = useCategories();

  const {
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
  } = useTodos();

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1 className={styles.title}>My Tasks</h1>

        <TodoForm
          categories={categories}
          formError={formError}
          onSubmit={addTodo}
          onFormErrorClear={clearFormError}
        />

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <TodoList
          todos={todos}
          loading={loading}
          error={error}
          onComplete={completeTodo}
          onDelete={deleteTodo}
        />
      </main>

      {/* Snackbar — positioned fixed via CSS, rendered inline (no portal) */}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          onUndo={undoAction}
          onDismiss={dismissSnackbar}
        />
      )}
    </div>
  );
}
