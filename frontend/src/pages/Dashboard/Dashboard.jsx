import { useEffect, useState } from "react";
import { getProductCount } from "../../api/productApi";
import { getCustomerCount } from "../../api/customerApi";
import { getOrderCount } from "../../api/orderApi";
import Loader from "../../components/Loader";
import { getLowStockProducts } from "../../api/productApi";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    customers: 0,
    orders: 0,
  });
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, customersRes, ordersRes, lowStockRes] =
          await Promise.all([
            getProductCount(),
            getCustomerCount(),
            getOrderCount(),
            getLowStockProducts(10, 5),
          ]);

        setCounts({
          products: productsRes.data || 0,
          customers: customersRes.data || 0,
          orders: ordersRes.data || 0,
        });

        setLowStock(lowStockRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pb-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-50 rounded-full mb-3 text-indigo-600">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Total Products
          </h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {counts.products}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 rounded-full mb-3 text-emerald-600">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Total Customers
          </h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {counts.customers}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-50 rounded-full mb-3 text-purple-600">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Total Orders
          </h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {counts.orders}
          </p>
        </div>
      </div>

      {/* Low Stock Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Low Stock Alert</h2>
            <p className="text-sm text-gray-500 mt-1">
              Products with 10 or fewer items in inventory
            </p>
          </div>
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            {lowStock.length} Items Found
          </span>
        </div>

        {lowStock.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto text-gray-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700">
              Inventory is healthy
            </p>
            <p className="text-sm">
              No products are currently running low on stock.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                    Product Name
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                    SKU
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">
                    Price
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">
                    Stock Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {lowStock.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 text-right text-gray-700 font-medium">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          product.stock_quantity === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {product.stock_quantity} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
