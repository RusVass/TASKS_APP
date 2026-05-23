import { useState, useRef, useCallback } from 'react';
import type { SnackbarState, SnackbarAction } from '../types';

export const SNACKBAR_DURATION_MS = 5000;

interface UseSnackbarReturn {
  snackbar: SnackbarState | null;
  showSnackbar: (message: string, action: SnackbarAction, onExpire: () => void) => void;
  dismissSnackbar: () => void;
}

export function useSnackbar(): UseSnackbarReturn {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);
  // Holds the auto-dismiss timer so we can cancel it on Undo or early dismiss
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissSnackbar = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSnackbar(null);
  }, []);

  const showSnackbar = useCallback(
    (message: string, action: SnackbarAction, onExpire: () => void) => {
      // Clear any existing timer (previous action is committed now)
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setSnackbar({ message, action });

      timerRef.current = setTimeout(() => {
        setSnackbar(null);
        timerRef.current = null;
        onExpire();
      }, SNACKBAR_DURATION_MS);
    },
    []
  );

  return { snackbar, showSnackbar, dismissSnackbar };
}
