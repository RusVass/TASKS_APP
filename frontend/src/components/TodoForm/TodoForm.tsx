import { useForm } from 'react-hook-form';
import type { Category, CreateTodoFormValues } from '../../types';
import styles from './TodoForm.module.scss';

interface TodoFormProps {
  categories: Category[];
  formError: string | null;
  onSubmit: (text: string, category: Category) => Promise<boolean>;
  onFormErrorClear: () => void;
}

export function TodoForm({ categories, formError, onSubmit, onFormErrorClear }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoFormValues>({
    defaultValues: { text: '', category: '' },
  });

  const submit = handleSubmit(async (values) => {
    // category is guaranteed non-empty by validation below
    const success = await onSubmit(values.text, values.category as Category);
    if (success) reset();
  });

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <input
            className={`${styles.input} ${errors.text ? styles.inputError : ''}`}
            placeholder="What needs to be done?"
            aria-label="Task text"
            {...register('text', { required: 'Task text is required' })}
            onChange={(e) => {
              if (formError) onFormErrorClear();
              register('text').onChange(e);
            }}
          />
          {errors.text && (
            <span className={styles.fieldError}>{errors.text.message}</span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <select
            className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
            aria-label="Task category"
            {...register('category', { required: 'Please select a category' })}
            onChange={(e) => {
              if (formError) onFormErrorClear();
              register('category').onChange(e);
            }}
          >
            <option value="">Select category…</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className={styles.fieldError}>{errors.category.message}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding…' : 'Add Task'}
        </button>
      </div>

      {formError && <p className={styles.apiError}>{formError}</p>}
    </form>
  );
}
