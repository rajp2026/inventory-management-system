import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../api/orderApi';
import Loader from '../../components/Loader';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const OrderDetail = () => {
  const { id } = useParams();
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrder(id);
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl shadow-sm border border-red-200">
        Failed to load order details. {error?.message}
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Order Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">ID: {order.id}</p>
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-base font-medium text-gray-900">{order.customer_name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Customer ID</p>
              <p className="text-sm text-gray-600 break-all">{order.customer_id}</p>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.total_amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Items</p>
              <p className="text-sm text-gray-600">{order.order_items.length} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Order Items</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-500">Product Name</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-center">Quantity</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-right">Unit Price</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {order.order_items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{item.product_name || '—'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">ID: {item.product_id}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right font-semibold text-gray-700 text-base border-r border-gray-200">
                  Grand Total
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900 text-lg">
                  {formatCurrency(order.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
