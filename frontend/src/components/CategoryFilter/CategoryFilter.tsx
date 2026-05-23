import type { Category } from '../../types';
import styles from './CategoryFilter.module.scss';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: Category | null;
  onSelect: (category: Category | null) => void;
}

export function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className={styles.filter}>
      <button
        type="button"
        className={`${styles.pill} ${activeCategory === null ? styles.active : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`${styles.pill} ${activeCategory === category ? styles.active : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
