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
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4">
        <ProductDropdown
          products={products}
          selectedProductId={row.productId}
          onChange={handleProductChange}
        />
        <div className="md:hidden mt-2 space-y-1">
          {row.productName && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Name:</span> {row.productName}
            </div>
          )}
          {row.unitPrice > 0 && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Price:</span> ${row.unitPrice.toFixed(2)}
            </div>
          )}
        </div>
      </td>
      <td className="hidden md:table-cell px-4 py-4">
        <div className="text-sm text-gray-900">
          {row.productName || '-'}
        </div>
      </td>
      <td className="hidden sm:table-cell px-4 py-4">
        <div className="text-sm text-gray-900">
          {row.unitPrice ? `$${row.unitPrice.toFixed(2)}` : '-'}
        </div>
      </td>
      <td className="px-4 py-4">
        <input
          type="number"
          min="1"
          step="1"
          value={row.quantity || ''}
          onChange={handleQuantityChange}
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
          placeholder="0"
        />
      </td>
      <td className="px-4 py-4">
        <div className="text-sm font-semibold text-gray-900">
          {row.subtotal ? `$${row.subtotal.toFixed(2)}` : '$0.00'}
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <button
          onClick={() => onRemove(row.id)}
          className="inline-flex items-center text-red-600 hover:text-red-900 text-sm font-medium transition-colors focus:outline-none focus:underline"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export default OrderRow;
