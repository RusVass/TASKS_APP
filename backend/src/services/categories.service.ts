import { CATEGORIES, Category } from '../types';

// Categories are hardcoded constants — no database table needed
// Spread into a new array to convert readonly tuple to mutable array
export function getAllCategories(): Category[] {
  return [...CATEGORIES];
}
