import { readJson, writeJson } from '../database/fileStorage.js';
import { AppError } from '../utils/AppError.js';
import { randomUUID } from 'crypto';

const ORDERS_FILE = 'orders.json';
const PRODUCTS_FILE = 'products.json';

/**
 * Get all orders
 * @returns {Promise<Array>} Array of all orders
 */
export const getAllOrders = async () => {
  const orders = await readJson(ORDERS_FILE);
  return orders;
};

/**
 * Get a single order by ID
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Order object
 * @throws {AppError} If order not found
 */
export const getOrderById = async (id) => {
  const orders = await readJson(ORDERS_FILE);
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  
  return order;
};

/**
 * Validate and enrich order items with product data
 * @param {Array} orderItems - Array of order items from request
 * @returns {Promise<Array>} Validated and enriched order items
 * @throws {AppError} If validation fails
 */
const validateAndEnrichOrderItems = async (orderItems) => {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new AppError('Order must contain at least one item', 400);
  }

  const products = await readJson(PRODUCTS_FILE);
  const enrichedItems = [];

  for (const item of orderItems) {
    // Validate quantity
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new AppError('Each item must have a valid quantity greater than 0', 400);
    }

    // Validate productId
    if (!item.productId) {
      throw new AppError('Each item must have a productId', 400);
    }

    // Find product in products.json
    const product = products.find(p => p.id === item.productId);
    
    if (!product) {
      throw new AppError(`Product with ID ${item.productId} not found`, 404);
    }

    // Enrich item with product data (enforce pricing integrity)
    const enrichedItem = {
      productId: product.id,
      productName: product.name,  // From product data, not frontend
      unitPrice: product.price,   // From product data, not frontend
      quantity: item.quantity,
      subtotal: product.price * item.quantity  // Calculate on backend
    };

    enrichedItems.push(enrichedItem);
  }

  return enrichedItems;
};

/**
 * Calculate total amount from order items
 * @param {Array} orderItems - Array of enriched order items
 * @returns {number} Total amount
 */
const calculateTotalAmount = (orderItems) => {
  return orderItems.reduce((total, item) => total + item.subtotal, 0);
};

/**
 * Create a new order
 * @param {Object} orderData - Order data (customerName, orderItems)
 * @returns {Promise<Object>} Created order
 * @throws {AppError} If validation fails or save fails
 */
export const createOrder = async (orderData) => {
  // Validate customer name
  if (!orderData.customerName || orderData.customerName.trim() === '') {
    throw new AppError('Customer name is required', 400);
  }

  // Validate and enrich order items (includes product lookup and price enforcement)
  const enrichedItems = await validateAndEnrichOrderItems(orderData.orderItems);

  // Calculate total amount on backend
  const totalAmount = calculateTotalAmount(enrichedItems);

  // Read existing orders
  const orders = await readJson(ORDERS_FILE);

  // Create new order
  const newOrder = {
    id: randomUUID(),
    customerName: orderData.customerName.trim(),
    date: new Date().toISOString(),
    status: orderData.status || 'pending',  // Default to 'pending'
    orderItems: enrichedItems,
    totalAmount: totalAmount,  // Backend-calculated total
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Add to orders array
  orders.push(newOrder);

  // Save to file
  const success = await writeJson(ORDERS_FILE, orders);

  if (!success) {
    throw new AppError('Failed to save order', 500);
  }

  return newOrder;
};

/**
 * Update an existing order
 * @param {string} id - Order ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated order
 * @throws {AppError} If order not found or validation fails
 */
export const updateOrder = async (id, updates) => {
  // Read existing orders
  const orders = await readJson(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) {
    throw new AppError('Order not found', 404);
  }

  const existingOrder = orders[index];

  // Validate customer name if provided
  if (updates.customerName !== undefined && updates.customerName.trim() === '') {
    throw new AppError('Customer name cannot be empty', 400);
  }

  // If orderItems are being updated, validate and recalculate
  let enrichedItems = existingOrder.orderItems;
  let totalAmount = existingOrder.totalAmount;

  if (updates.orderItems) {
    enrichedItems = await validateAndEnrichOrderItems(updates.orderItems);
    totalAmount = calculateTotalAmount(enrichedItems);
  }

  // Update order
  const updatedOrder = {
    ...existingOrder,
    ...(updates.customerName && { customerName: updates.customerName.trim() }),
    ...(updates.status && { status: updates.status }),
    ...(updates.orderItems && { orderItems: enrichedItems }),
    ...(updates.orderItems && { totalAmount: totalAmount }),  // Recalculate if items changed
    updatedAt: new Date().toISOString()
  };

  orders[index] = updatedOrder;

  // Save to file
  const success = await writeJson(ORDERS_FILE, orders);

  if (!success) {
    throw new AppError('Failed to update order', 500);
  }

  return updatedOrder;
};

/**
 * Delete an order
 * @param {string} id - Order ID
 * @returns {Promise<boolean>} True if deleted
 * @throws {AppError} If order not found
 */
export const deleteOrder = async (id) => {
  const orders = await readJson(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) {
    throw new AppError('Order not found', 404);
  }

  // Remove order
  orders.splice(index, 1);

  // Save to file
  const success = await writeJson(ORDERS_FILE, orders);

  if (!success) {
    throw new AppError('Failed to delete order', 500);
  }

  return true;
};
