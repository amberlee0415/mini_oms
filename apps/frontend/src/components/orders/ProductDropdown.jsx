function ProductDropdown({ products, selectedProductId, onChange, disabled }) {
  return (
    <select
      value={selectedProductId || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      disabled={disabled}
    >
      <option value="">Select Product</option>
      {products.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name} - ${product.price.toFixed(2)}
        </option>
      ))}
    </select>
  );
}

export default ProductDropdown;
