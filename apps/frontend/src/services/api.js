const API_BASE_URL = '/api';

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint (e.g., '/products')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    let data = null;
    if (hasJsonContent) {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    }

    if (!response.ok) {
      throw new Error(data?.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Product API methods (to be implemented)
 */
export const productApi = {
  getAll: () => apiRequest('/products'),
  getById: (id) => apiRequest(`/products/${id}`),
  create: (data) => apiRequest('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

/**
 * Order API methods (to be implemented)
 */
export const orderApi = {
  getAll: () => apiRequest('/orders'),
  getById: (id) => apiRequest(`/orders/${id}`),
  create: (data) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' }),
};
