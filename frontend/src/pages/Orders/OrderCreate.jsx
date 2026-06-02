import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder, getAllCustomers, getAllProducts } from '../../api/orderApi';
import Loader from '../../components/Loader';

export default function OrderCreate() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderItems, setOrderItems] = useState([
    { product_id: "", quantity: 1 }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          getAllCustomers(1, 200),
          getAllProducts(1, 200)
        ]);
        setCustomers(custRes.data || []);
        setProducts(prodRes.data || []);
      } catch (error) {
        console.error("Failed to load form data:", error);
        setApiError("Failed to load customers and products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addItem = () => {
    setOrderItems([...orderItems, { product_id: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    if (orderItems.length <= 1) return;
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  };

  const getSelectedProductIds = () => {
    return orderItems.map(item => item.product_id).filter(Boolean);
  };

  const getProductPrice = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? parseFloat(product.price) : 0;
  };

  const getProductStock = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.stock_quantity : 0;
  };

  const calculateLineTotal = (item) => {
    if (!item.product_id) return 0;
    return getProductPrice(item.product_id) * item.quantity;
  };

  const calculateOrderTotal = () => {
    return orderItems.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const validate = () => {
    if (!selectedCustomer) return "Please select a customer.";
    for (let i = 0; i < orderItems.length; i++) {
      if (!orderItems[i].product_id) return `Please select a product for item #${i + 1}.`;
      if (!orderItems[i].quantity || orderItems[i].quantity < 1) return `Quantity must be at least 1 for item #${i + 1}.`;
      const stock = getProductStock(orderItems[i].product_id);
      if (orderItems[i].quantity > stock) return `Insufficient stock for item #${i + 1}. Available: ${stock}.`;
    }
    const productIds = orderItems.map(i => i.product_id);
    if (new Set(productIds).size !== productIds.length) return "Duplicate products are not allowed. Please remove duplicates.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationError = validate();
    if (validationError) {
      setApiError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_id: selectedCustomer,
        items: orderItems.map(item => ({
          product_id: item.product_id,
          quantity: parseInt(item.quantity, 10)
        }))
      };
      await createOrder(payload);
      navigate("/orders");
    } catch (error) {
      console.error("Create order error:", error);
      setApiError(error.response?.data?.message || "Failed to create order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/orders" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white ${!selectedCustomer ? 'text-gray-400' : 'text-gray-900'} border-gray-300`}
            >
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} — {c.email}
                </option>
              ))}
            </select>
          </div>

          {/* Order Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Order Items</label>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Product Name</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {orderItems.map((item, index) => {
                  const selectedIds = getSelectedProductIds();
                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50/50 transition-colors">
                      {/* Product Name */}
                      <div className="col-span-5">
                        <select
                          value={item.product_id}
                          onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                          className={`w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-sm ${!item.product_id ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          <option value="">Select product...</option>
                          {products.map((p) => (
                            <option
                              key={p.id}
                              value={p.id}
                              disabled={selectedIds.includes(p.id) && item.product_id !== p.id}
                            >
                              {p.name} (Stock: {p.stock_quantity})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          max={item.product_id ? getProductStock(item.product_id) : 9999}
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value, 10) || 1)}
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm text-center"
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-2 text-right">
                        <span className="text-sm text-gray-600">
                          {item.product_id ? formatCurrency(getProductPrice(item.product_id)) : '—'}
                        </span>
                      </div>

                      {/* Line Total */}
                      <div className="col-span-2 text-right">
                        <span className="text-sm font-semibold text-gray-800">
                          {formatCurrency(calculateLineTotal(item))}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={orderItems.length <= 1}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Item Button — below rows */}
              <div className="border-t border-gray-200 px-4 py-3 bg-white">
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Product
                </button>
              </div>

              {/* Grand Total Row */}
              <div className="border-t-2 border-gray-300 bg-gray-50">
                <div className="grid grid-cols-12 gap-2 px-4 py-4 items-center">
                  <div className="col-span-9 text-right">
                    <span className="text-base font-semibold text-gray-700">Grand Total</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(calculateOrderTotal())}</span>
                  </div>
                  <div className="col-span-1"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex justify-end gap-3">
            <Link
              to="/orders"
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
