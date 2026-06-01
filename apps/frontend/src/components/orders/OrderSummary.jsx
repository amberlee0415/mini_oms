function OrderSummary({ totalAmount }) {
  return (
    <div className="mt-4 flex justify-end">
      <div className="bg-gray-50 px-6 py-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
