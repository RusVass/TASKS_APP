import { Router, Request, Response } from 'express';
import { getAllCategories } from '../services/categories.service';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const categories = getAllCategories();
  res.json({ categories });
});

export default router;
