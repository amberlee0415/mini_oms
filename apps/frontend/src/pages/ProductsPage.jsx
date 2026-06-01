import { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import ProductTable from '../components/products/ProductTable';
import ProductFormModal from '../components/products/ProductFormModal';
import ConfirmDeleteModal from '../components/products/ConfirmDeleteModal';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getAll();
      setProducts(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    // Prevent duplicate submissions
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading(true);
      
      if (selectedProduct) {
        await productApi.update(selectedProduct.id, formData);
      } else {
        await productApi.create(formData);
      }
      
      setIsFormModalOpen(false);
      setSelectedProduct(null);
      await fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    // Prevent duplicate submissions
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading(true);
      await productApi.delete(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      await fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
      console.error('Error deleting product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseModals = () => {
    if (!actionLoading) {
      setIsFormModalOpen(false);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Manage your product catalog
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Product
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <ProductFormModal
          isOpen={isFormModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleFormSubmit}
          product={selectedProduct}
          loading={actionLoading}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          product={selectedProduct}
          loading={actionLoading}
        />
      </div>
    </div>
  );
}

export default ProductsPage;
