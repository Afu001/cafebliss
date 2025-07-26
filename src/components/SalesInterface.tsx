import { useState } from 'react';
import type { Item, Category, CartItem, Sale } from '../types/pos';

interface SalesInterfaceProps {
  items: Item[];
  categories: Category[];
  onCompleteSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'receiptNumber'>) => void;
}

export const SalesInterface = ({ items, categories, onCompleteSale }: SalesInterfaceProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [discount, setDiscount] = useState(0);

  const TAX_RATE = 0.05; // 10% tax

  const addToCart = (item: Item) => {
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.item.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  };

  const getDiscountAmount = () => {
    return getSubtotal() * (discount / 100);
  };

  const getTaxAmount = () => {
    return (getSubtotal() - getDiscountAmount()) * TAX_RATE;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() + getTaxAmount();
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const sale = {
      items: cart,
      subtotal: getSubtotal(),
      discount: getDiscountAmount(),
      tax: getTaxAmount(),
      total: getTotal(),
      paymentMethod
    };

    onCompleteSale(sale);
    setCart([]);
    setDiscount(0);
  };

  const getCategoryName = (categoryId: string) => {

    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: string) => {

    return categories.find(cat => cat.id === categoryId)?.color || '#666';
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.categoryId === selectedCategory);

  const groupedItems = categories.reduce((acc, category) => {
    acc[category.id] = filteredItems.filter(item => item.categoryId === category.id);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Selection */}
      <div className="lg:col-span-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedCategory === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="space-y-4">
            {selectedCategory === 'all' ? (
              categories.map((category) => {
                const categoryItems = groupedItems[category.id];
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h3 
                      className="font-semibold mb-3 pb-1 border-b flex items-center gap-2"
                      style={{ borderBottomColor: category.color }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {categoryItems.map((item) => (
                        <ItemCard key={item.id} item={item} onAdd={addToCart} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} onAdd={addToCart} />
                ))}
              </div>
            )}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-text-muted">
              No items available in this category.
            </div>
          )}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Current Sale</h2>
        
        {/* Cart Items */}
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {cart.map((cartItem) => (
            <div key={cartItem.item.id} className="flex items-center justify-between bg-secondary rounded-lg p-3">
              <div className="flex-1">
                <h4 className="font-medium">{cartItem.item.name}</h4>
                <p className="text-sm text-text-muted">
                  PKR{cartItem.item.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-danger text-danger-foreground hover:bg-danger-hover"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-success text-success-foreground hover:bg-success-hover"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(cartItem.item.id)}
                  className="ml-2 text-danger hover:text-danger-hover"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length === 0 && (
          <div className="text-center py-6 text-text-muted">
            Cart is empty
          </div>
        )}

        {cart.length > 0 && (
          <>
            {/* Discount */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                className="input w-full"
              />
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 px-3 rounded-lg text-sm ${
                    paymentMethod === 'cash' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
                  }`}
                >
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-lg text-sm ${
                    paymentMethod === 'card' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
                  }`}
                >
                  Card
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>PKR{getSubtotal().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount ({discount}%):</span>
                  <span>-PKR{getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>PKR{getTaxAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>PKR {getTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCompleteSale}
              className="w-full mt-4 btn btn-success text-lg py-3"
            >
              Complete Sale
            </button>
          </>
        )}
      </div>
        {false && getCategoryColor}
              {false && getCategoryName}
    </div>
  );
};

const ItemCard = ({ item, onAdd }: { item: Item; onAdd: (item: Item) => void }) => (
  <button
    onClick={() => onAdd(item)}
    className="p-3 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all bg-card text-card-foreground text-left"
  >
    <h4 className="font-medium mb-1">{item.name}</h4>
    <p className="text-primary font-bold">PKR {item.price.toFixed(2)}</p>
    {item.stock !== undefined && (
      <p className="text-xs text-text-muted mt-1">Stock: {item.stock}</p>
    )}
  </button>
);