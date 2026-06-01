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
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orderRows.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No items added. Click "Add Item" to start building your order.
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

      <div className="mt-4">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Item
        </button>
      </div>

      <OrderSummary totalAmount={totalAmount} />
    </div>
  );
}

export default OrderGrid;
