function OrderSummary({ totalAmount }) {
  return (
    <div className="flex justify-end">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 rounded-lg border-2 border-blue-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="text-sm sm:text-lg font-medium text-gray-700">Order Total:</span>
          <span className="text-3xl sm:text-4xl font-bold text-blue-600">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
