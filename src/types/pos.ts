export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  stock?: number;
  createdAt: Date;
}

export interface CartItem {
  item: Item;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card';
  createdAt: Date;
  receiptNumber: string;
}

export interface Receipt {
  sale: Sale;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  cashier: string;
}