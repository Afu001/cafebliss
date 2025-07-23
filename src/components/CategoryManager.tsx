import { useState } from 'react';
import type { Category } from '../types/pos';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  onDeleteCategory: (id: string) => void;
}

const CATEGORY_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
];

export const CategoryManager = ({ categories, onAddCategory, onDeleteCategory }: CategoryManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        color: selectedColor
      });
      setNewCategoryName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Categories</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn btn-primary"
        >
          {isAdding ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-secondary rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="input w-full"
              autoFocus
            />
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-2">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-foreground' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              Create Category
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 rounded-lg border"
            style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
          >
            <span className="font-medium">{category.name}</span>
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="text-danger hover:text-danger-hover text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {categories.length === 0 && !isAdding && (
        <div className="text-center py-8 text-text-muted">
          No categories yet. Add your first category to get started.
        </div>
      )}
    </div>
  );
};