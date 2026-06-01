import * as orderService from '../services/order.service.js';

/**
 * Get all orders
 * GET /api/orders
 */
export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single order by ID
 * GET /api/orders/:id
 */
export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    const newOrder = await orderService.createOrder(orderData);
    res.status(201).json({
      status: 'success',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing order
 * PUT /api/orders/:id
 */
export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedOrder = await orderService.updateOrder(id, updates);
    res.status(200).json({
      status: 'success',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an order
 * DELETE /api/orders/:id
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
