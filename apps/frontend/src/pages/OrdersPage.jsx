import { useState, useEffect } from 'react';
import { productApi, orderApi } from '../services/api';
import OrderGrid from '../components/orders/OrderGrid';

function OrdersPage() {
  const [products, setProducts] = useState([]);
  const [orderRows, setOrderRows] = useState([]);
  const [customerName, setCustomerName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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

  const validateOrder = () => {
    const errors = {};

    if (!customerName.trim()) {
      errors.customerName = 'Customer name is required';
    }

    if (orderRows.length === 0) {
      errors.orderRows = 'Order must contain at least one item';
    }

    const invalidRows = orderRows.filter(row => 
      !row.productId || !row.quantity || row.quantity <= 0
    );

    if (invalidRows.length > 0) {
      errors.orderRows = 'All items must have a product selected and quantity greater than 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateOrder()) {
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        customerName: customerName.trim(),
        orderItems: orderRows.map(row => ({
          productId: row.productId,
          quantity: row.quantity
        }))
      };

      await orderApi.create(orderData);

      setCustomerName('');
      setOrderRows([]);
      setValidationErrors({});
      alert('Order created successfully!');
    } catch (err) {
      alert(err.message || 'Failed to create order');
      console.error('Error creating order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCustomerName('');
    setOrderRows([]);
    setValidationErrors({});
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Order Management
        </h1>
        <p className="text-gray-600 mt-1">
          Create new orders with interactive order entry
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Information
          </h2>

          <div className="mb-4">
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`w-full max-w-md px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={submitting}
              placeholder="Enter customer name"
            />
            {validationErrors.customerName && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.customerName}</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Items
          </h2>

          {validationErrors.orderRows && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{validationErrors.orderRows}</p>
            </div>
          )}

          <OrderGrid
            products={products}
            orderRows={orderRows}
            setOrderRows={setOrderRows}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || orderRows.length === 0}
          >
            {submitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrdersPage;
