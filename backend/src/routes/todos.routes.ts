import { Router, Request, Response, NextFunction } from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  NotFoundError,
  CategoryLimitError,
} from '../services/todos.service';
import { createTodoSchema, updateTodoSchema } from '../validation/todo.schema';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const todos = getTodos(category);
  res.json({ todos });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const parsed = createTodoSchema.safeParse(req.body);

  if (!parsed.success) {
    // Zod v4 uses .issues instead of .errors
    const message = parsed.error.issues[0]?.message ?? 'Invalid input';
    res.status(400).json({ error: message });
    return;
  }

  try {
    const todo = createTodo(parsed.data);
    res.status(201).json(todo);
  } catch (err) {
    if (err instanceof CategoryLimitError) {
      res.status(422).json({ error: err.message });
      return;
    }
    next(err);
  }
});

router.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid todo ID' });
    return;
  }

  const parsed = updateTodoSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Invalid input';
    res.status(400).json({ error: message });
    return;
  }

  try {
    const todo = updateTodo(id, parsed.data);
    res.json(todo);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid todo ID' });
    return;
  }

  try {
    deleteTodo(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
});

export default router;
