import { useState } from 'react';
import type { Sale } from '../types/pos';

interface SalesHistoryProps {
  sales: Sale[];
  onViewReceipt: (sale: Sale) => void;
}

export const SalesHistory = ({ sales, onViewReceipt }: SalesHistoryProps) => {
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');

  const filteredSales = sales.filter(sale => {
    if (!dateFilter) return true;
    return sale.createdAt.toDateString() === new Date(dateFilter).toDateString();
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    if (sortBy === 'date') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    return b.total - a.total;
  });

  const getTotalSales = () => {
    return filteredSales.reduce((total, sale) => total + sale.total, 0);
  };

  const getTotalTransactions = () => {
    return filteredSales.length;
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sales History</h2>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
              className="input"
            >
              <option value="date">Date</option>
              <option value="total">Total Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-cyan-100/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-600">Total Sales</h3>
          <p className="text-2xl font-bold text-cyan-500">${getTotalSales().toFixed(2)}</p>
        </div>
        <div className="bg-green-100/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-600">Transactions</h3>
          <p className="text-2xl font-bold text-green-500">{getTotalTransactions()}</p>
        </div>
        <div className="bg-yellow-100/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-600">Average Sale</h3>
          <p className="text-2xl font-bold text-yellow-500">
            PKR{getTotalTransactions() > 0 ? (getTotalSales() / getTotalTransactions()).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 font-medium">Receipt #</th>
              <th className="text-left py-3 px-2 font-medium">Date</th>
              <th className="text-left py-3 px-2 font-medium">Time</th>
              <th className="text-left py-3 px-2 font-medium">Items</th>
              <th className="text-left py-3 px-2 font-medium">Payment</th>
              <th className="text-right py-3 px-2 font-medium">Total</th>
              <th className="text-center py-3 px-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-secondary/50">
                <td className="py-3 px-2 font-mono text-sm">{sale.receiptNumber}</td>
                <td className="py-3 px-2">{sale.createdAt.toLocaleDateString()}</td>
                <td className="py-3 px-2">{sale.createdAt.toLocaleTimeString()}</td>
                <td className="py-3 px-2">
                  <div className="text-sm">
                    {sale.items.map((item, index) => (
                      <div key={index}>
                        {item.quantity}x {item.item.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-2 capitalize">{sale.paymentMethod}</td>
                <td className="py-3 px-2 text-right font-bold">${sale.total.toFixed(2)}</td>
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => onViewReceipt(sale)}
                    className="btn btn-primary btn-sm"
                  >
                    View Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedSales.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          {sales.length === 0 ? 'No sales recorded yet.' : 'No sales found for the selected date.'}
        </div>
      )}
    </div>
  );
};