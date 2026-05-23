import styles from './Snackbar.module.scss';

interface SnackbarProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export function Snackbar({ message, onUndo, onDismiss }: SnackbarProps) {
  return (
    <div className={styles.snackbar} role="status" aria-live="polite">
      <span className={styles.message}>{message}</span>
      <div className={styles.actions}>
        <button type="button" className={styles.undoButton} onClick={onUndo}>
          Undo
        </button>
        <button type="button" className={styles.dismissButton} onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  );
}
