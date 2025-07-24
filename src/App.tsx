import { useState } from 'react';
import type { Category, Item, Sale, Receipt as ReceiptType } from './types/pos';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CategoryManager } from './components/CategoryManager';
import { ItemManager } from './components/ItemManager';
import { SalesInterface } from './components/SalesInterface';
import { Receipt } from './components/Receipt';
import { SalesHistory } from './components/SalesHistory';

type Tab = 'sales' | 'categories' | 'items' | 'history';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('sales');
  const [categories, setCategories] = useLocalStorage<Category[]>('pos-categories', []);
  const [items, setItems] = useLocalStorage<Item[]>('pos-items', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('pos-sales', []);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptType | null>(null);

  // Store configuration
  const [storeConfig] = useLocalStorage('pos-store-config', {
    name: 'Cafe Bliss',
    address: 'Shop 11, Rooftop Central Park DHA phase 2',
    phone: '+92 3340505725',
    cashier: 'Baqir'
  });

  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    // Remove category and all items in that category
    setCategories(categories.filter(cat => cat.id !== id));
    setItems(items.filter(item => item.categoryId !== id));
  };

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const completeSale = (saleData: Omit<Sale, 'id' | 'createdAt' | 'receiptNumber'>) => {
    const receiptNumber = `R${Date.now().toString().slice(-6)}`;
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      receiptNumber,
      createdAt: new Date()
    };
    
    setSales([...sales, newSale]);
    
    // Show receipt
    const receipt: ReceiptType = {
      sale: newSale,
      storeName: storeConfig.name,
      storeAddress: storeConfig.address,
      storePhone: storeConfig.phone,
      cashier: storeConfig.cashier
    };
    
    setCurrentReceipt(receipt);
  };

  const printReceipt = () => {
    window.print();
  };

  const viewReceiptFromHistory = (sale: Sale) => {
    const receipt: ReceiptType = {
      sale,
      storeName: storeConfig.name,
      storeAddress: storeConfig.address,
      storePhone: storeConfig.phone,
      cashier: storeConfig.cashier
    };
    
    setCurrentReceipt(receipt);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">
              {storeConfig.name} - POS System By Aswad for Baqir
            </h1>
            <div className="text-sm text-text-muted">
              {new Date().toLocaleDateString()} | {storeConfig.cashier}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'sales', label: 'Sales' },
              { id: 'categories', label: 'Categories' },
              { id: 'items', label: 'Items' },
              { id: 'history', label: 'History' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {activeTab === 'sales' && (
          <SalesInterface
            items={items}
            categories={categories}
            onCompleteSale={completeSale}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
        )}

        {activeTab === 'items' && (
          <ItemManager
            items={items}
            categories={categories}
            onAddItem={addItem}
            onDeleteItem={deleteItem}
          />
        )}

        {activeTab === 'history' && (
          <SalesHistory
            sales={sales}
            onViewReceipt={viewReceiptFromHistory}
          />
        )}
      </main>

      {/* Receipt Modal */}
      {currentReceipt && (
        <Receipt
          receipt={currentReceipt}
          onPrint={printReceipt}
          onClose={() => setCurrentReceipt(null)}
        />
      )}
    </div>
  );
};

export default Index;