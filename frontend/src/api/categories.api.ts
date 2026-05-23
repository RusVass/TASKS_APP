import api from './axiosInstance';
import type { Category } from '../types';

export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<{ categories: Category[] }>('/categories');
  return response.data.categories;
}
