import * as productService from '../services/product.service.js';

/**
 * Get all products
 * GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      status: 'success',
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single product by ID
 * GET /api/products/:id
 */
export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const newProduct = await productService.createProduct(productData);
    res.status(201).json({
      status: 'success',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedProduct = await productService.updateProduct(id, updates);
    res.status(200).json({
      status: 'success',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
