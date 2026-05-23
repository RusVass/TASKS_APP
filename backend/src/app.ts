import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos.routes';
import categoriesRouter from './routes/categories.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://tasks-app-iota.vercel.app',
  ],
}));

app.use('/todos', todosRouter);
app.use('/categories', categoriesRouter);

// Global error handler — must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
