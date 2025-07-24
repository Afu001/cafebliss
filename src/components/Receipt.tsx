import type { Receipt as ReceiptType } from '../types/pos';

interface ReceiptProps {
  receipt: ReceiptType;
  onPrint: () => void;
  onClose: () => void;
}

export const Receipt = ({ receipt, onPrint, onClose }: ReceiptProps) => {
  const { sale, storeName, storeAddress, storePhone, cashier } = receipt;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Controls */}
        <div className="no-print flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Receipt Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={onPrint}
              className="btn btn-primary"
            >
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="receipt" style={{ color: 'black' }}>
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-bold mb-1">{storeName}</h1>
            <p className="text-sm">{storeAddress}</p>
            <p className="text-sm">{storePhone}</p>
            <div className="border-t border-b border-black my-2 py-1">
              <p className="text-sm">Receipt #{sale.receiptNumber}</p>
            </div>
          </div>

          {/* Date and Cashier */}
          <div className="text-sm mb-3">
            <p>Date: {sale.createdAt.toLocaleDateString()}</p>
            <p>Time: {sale.createdAt.toLocaleTimeString()}</p>
            <p>Cashier: {cashier}</p>
            <p>Payment: {sale.paymentMethod.toUpperCase()}</p>
          </div>

          <div className="border-t border-black mb-3"></div>

          {/* Items */}
          <div className="mb-3">
            {sale.items.map((cartItem, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between">
                  <span>{cartItem.item.name}</span>
                  <span>PKR{cartItem.item.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="ml-2">{cartItem.quantity} x PKR{cartItem.item.price.toFixed(2)}</span>
                  <span>PKR{(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-black mb-3"></div>

          {/* Totals */}
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>PKR{sale.subtotal.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-PKR{sale.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>PKR{sale.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-black pt-1">
              <div className="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>PKR{sale.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-black mt-3 pt-3 text-center text-sm">
            <p>Thank you for your business!</p>
            <p>Please come again</p>
          </div>
        </div>
      </div>
    </div>
  );
};