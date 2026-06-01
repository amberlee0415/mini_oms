import ProductDropdown from './ProductDropdown';

function OrderRow({ row, products, onProductChange, onQuantityChange, onRemove }) {
  const handleProductChange = (productId) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      onProductChange(row.id, {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        unitPrice: selectedProduct.price
      });
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    
    // Allow empty input for user to clear and retype
    if (value === '') {
      onQuantityChange(row.id, 0);
      return;
    }
    
    // Parse as integer
    const quantity = parseInt(value, 10);
    
    // Validate: must be a valid integer >= 0
    if (isNaN(quantity) || quantity < 0) {
      return; // Ignore invalid input
    }
    
    onQuantityChange(row.id, quantity);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3">
        <ProductDropdown
          products={products}
          selectedProductId={row.productId}
          onChange={handleProductChange}
        />
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-900">
          {row.productName || '-'}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-900">
          {row.unitPrice ? `$${row.unitPrice.toFixed(2)}` : '-'}
        </div>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min="1"
          step="1"
          value={row.quantity || ''}
          onChange={handleQuantityChange}
          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">
          {row.subtotal ? `$${row.subtotal.toFixed(2)}` : '$0.00'}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onRemove(row.id)}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export default OrderRow;
