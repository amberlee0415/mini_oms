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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Product
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
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
  );
}

export default ProductsPage;
