import { z } from 'zod';
import { CATEGORIES } from '../types';

// Zod v4: use `error` instead of v3's `required_error` / `error_map`
export const createTodoSchema = z.object({
  text: z
    .string({ error: 'Text is required' })
    .min(1, 'Text cannot be empty')
    .max(200, 'Text cannot exceed 200 characters')
    .transform((val) => val.trim()),
  category: z.enum(CATEGORIES, { error: 'Invalid category' }),
});

export const updateTodoSchema = z.object({
  completed: z.boolean({ error: 'completed field is required' }),
});
