import { useState, useEffect } from 'react';
import { calculateSubtotal, calculateOrderTotal } from '../../utils/orderCalculations';
import OrderRow from './OrderRow';
import OrderSummary from './OrderSummary';

function OrderGrid({ products, orderRows, setOrderRows }) {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = calculateOrderTotal(orderRows);  // Use shared utility
    setTotalAmount(total);
  }, [orderRows]);

  const addRow = () => {
    const newRow = {
      id: Date.now().toString(),
      productId: '',
      productName: '',
      unitPrice: 0,
      quantity: 0,
      subtotal: 0
    };
    setOrderRows([...orderRows, newRow]);
  };

  const removeRow = (rowId) => {
    setOrderRows(orderRows.filter(row => row.id !== rowId));
  };

  const handleProductChange = (rowId, productData) => {
    setOrderRows(orderRows.map(row => {
      if (row.id === rowId) {
        const quantity = row.quantity || 0;
        const subtotal = calculateSubtotal(productData.unitPrice, quantity);  // Use shared utility
        return {
          ...row,
          productId: productData.productId,
          productName: productData.productName,
          unitPrice: productData.unitPrice,
          subtotal: subtotal
        };
      }
      return row;
    }));
  };

  const handleQuantityChange = (rowId, quantity) => {
    setOrderRows(orderRows.map(row => {
      if (row.id === rowId) {
        const subtotal = calculateSubtotal(row.unitPrice, quantity);  // Use shared utility
        return {
          ...row,
          quantity: quantity,
          subtotal: subtotal
        };
      }
      return row;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-4 text-sm text-gray-500">No items added yet</p>
                    <p className="mt-1 text-xs text-gray-400">Click "Add Item" below to start building your order</p>
                  </td>
                </tr>
              ) : (
                orderRows.map((row) => (
                  <OrderRow
                    key={row.id}
                    row={row}
                    products={products}
                    onProductChange={handleProductChange}
                    onQuantityChange={handleQuantityChange}
                    onRemove={removeRow}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={addRow}
          type="button"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      <OrderSummary totalAmount={totalAmount} />
    </div>
  );
}

export default OrderGrid;
