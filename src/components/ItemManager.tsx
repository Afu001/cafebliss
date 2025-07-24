import { useState } from 'react';
import type { Item, Category } from '../types/pos';

interface ItemManagerProps {
  items: Item[];
  categories: Category[];
  onAddItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  onDeleteItem: (id: string) => void;
}

export const ItemManager = ({ items, categories, onAddItem, onDeleteItem }: ItemManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    categoryId: '',
    description: '',
    stock: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name.trim() && newItem.categoryId && newItem.price > 0) {
      onAddItem({
        ...newItem,
        name: newItem.name.trim(),
        description: newItem.description.trim() || undefined,
        stock: newItem.stock || undefined
      });
      setNewItem({ name: '', price: 0, categoryId: '', description: '', stock: 0 });
      setIsAdding(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || '#666';
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Items</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn btn-primary"
          disabled={categories.length === 0}
        >
          {isAdding ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {categories.length === 0 && (
        <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-4">
          <p className="text-warning-foreground">Please create at least one category before adding items.</p>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-secondary rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Item Name*</label>
              <input
                type="text"
                placeholder="Enter item name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="input w-full"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price*</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newItem.price || ''}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category*</label>
              <select
                value={newItem.categoryId}
                onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                className="input w-full"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock (optional)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={newItem.stock || ''}
                onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                className="input w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea
                placeholder="Item description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="input w-full h-20 resize-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-success">
              Add Item
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryItems = items.filter(item => item.categoryId === category.id);
          
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category.id} className="border rounded-lg p-4">
              <h3 
                className="font-semibold mb-3 pb-2 border-b flex items-center gap-2"
                style={{ borderBottomColor: category.color }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-danger hover:text-danger-hover text-sm"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-lg font-bold text-primary mb-1">
                      PKR{item.price.toFixed(2)}
                    </p>
                    {item.stock !== undefined && (
                      <p className="text-sm text-text-muted">Stock: {item.stock}</p>
                    )}
                    {item.description && (
                      <p className="text-sm text-text-muted mt-2">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
              {false && getCategoryColor}
              {false && getCategoryName}
            </div>
          );
        })}
      </div>

      {items.length === 0 && !isAdding && categories.length > 0 && (
        <div className="text-center py-8 text-text-muted">
          No items yet. Add your first item to get started.
        </div>
      )}
    </div>
  );
  
};