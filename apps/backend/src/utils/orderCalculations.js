/**
 * Shared calculation utilities for order processing
 * Used by both backend services and frontend components
 * Ensures consistency across the application
 */

/**
 * Calculate subtotal for a single order item
 * @param {number} unitPrice - Price per unit
 * @param {number} quantity - Quantity ordered
 * @returns {number} Subtotal (unitPrice × quantity)
 */
export const calculateSubtotal = (unitPrice, quantity) => {
  // Ensure numeric values
  const price = Number(unitPrice) || 0;
  const qty = Number(quantity) || 0;
  
  // Calculate subtotal
  return price * qty;
};

/**
 * Calculate total amount for an order
 * @param {Array} orderItems - Array of order items with subtotal property
 * @returns {number} Total amount (sum of all subtotals)
 */
export const calculateOrderTotal = (orderItems) => {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return 0;
  }
  
  // Sum all subtotals
  return orderItems.reduce((total, item) => {
    const subtotal = Number(item.subtotal) || 0;
    return total + subtotal;
  }, 0);
};
