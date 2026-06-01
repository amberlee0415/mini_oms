function ProductTable({ products, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 bg-white rounded-lg border border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-sm text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center py-16 px-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-sm text-gray-500">Get started by creating your first product</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="md:hidden text-xs text-gray-500 mt-1">{product.description || 'No description'}</div>
                </td>
                <td className="hidden md:table-cell px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">{product.description || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => onEdit(product)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-900 transition-colors focus:outline-none focus:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="inline-flex items-center text-red-600 hover:text-red-900 transition-colors focus:outline-none focus:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
