import { readJson, writeJson } from '../database/fileStorage.js';
import { AppError } from '../utils/AppError.js';
import { randomUUID } from 'crypto';

const PRODUCTS_FILE = 'products.json';

/**
 * Get all products
 * @returns {Promise<Array>} Array of all products
 */
export const getAllProducts = async () => {
  const products = await readJson(PRODUCTS_FILE);
  return products;
};

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product object
 * @throws {AppError} If product not found
 */
export const getProductById = async (id) => {
  const products = await readJson(PRODUCTS_FILE);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  return product;
};

/**
 * Create a new product
 * @param {Object} productData - Product data (name, description, price)
 * @returns {Promise<Object>} Created product
 * @throws {AppError} If validation fails or save fails
 */
export const createProduct = async (productData) => {
  // Validate required fields
  if (!productData.name || productData.name.trim() === '') {
    throw new AppError('Product name is required', 400);
  }
  
  if (typeof productData.price !== 'number' || productData.price <= 0) {
    throw new AppError('Price must be a number greater than 0', 400);
  }
  
  // Read existing products
  const products = await readJson(PRODUCTS_FILE);
  
  // Create new product
  const newProduct = {
    id: randomUUID(),
    name: productData.name.trim(),
    description: productData.description?.trim() || '',
    price: productData.price,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to products array
  products.push(newProduct);
  
  // Save to file
  const success = await writeJson(PRODUCTS_FILE, products);
  
  if (!success) {
    throw new AppError('Failed to save product', 500);
  }
  
  return newProduct;
};

/**
 * Update an existing product
 * @param {string} id - Product ID
 * @param {Object} updates - Fields to update (name, description, price)
 * @returns {Promise<Object>} Updated product
 * @throws {AppError} If product not found or validation fails
 */
export const updateProduct = async (id, updates) => {
  // Validate updates if provided
  if (updates.name !== undefined && updates.name.trim() === '') {
    throw new AppError('Product name cannot be empty', 400);
  }
  
  if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price <= 0)) {
    throw new AppError('Price must be a number greater than 0', 400);
  }
  
  // Read existing products
  const products = await readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new AppError('Product not found', 404);
  }
  
  // Update product
  const updatedProduct = {
    ...products[index],
    ...(updates.name && { name: updates.name.trim() }),
    ...(updates.description !== undefined && { description: updates.description.trim() }),
    ...(updates.price && { price: updates.price }),
    updatedAt: new Date().toISOString()
  };
  
  products[index] = updatedProduct;
  
  // Save to file
  const success = await writeJson(PRODUCTS_FILE, products);
  
  if (!success) {
    throw new AppError('Failed to update product', 500);
  }
  
  return updatedProduct;
};

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} True if deleted
 * @throws {AppError} If product not found
 */
export const deleteProduct = async (id) => {
  const products = await readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new AppError('Product not found', 404);
  }
  
  // Remove product
  products.splice(index, 1);
  
  // Save to file
  const success = await writeJson(PRODUCTS_FILE, products);
  
  if (!success) {
    throw new AppError('Failed to delete product', 500);
  }
  
  return true;
};
