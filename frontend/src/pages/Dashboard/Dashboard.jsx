import { useEffect, useState } from 'react';
import { getProductCount } from '../../api/productApi';
import { getCustomerCount } from '../../api/customerApi';
import { getOrderCount } from '../../api/orderApi';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [counts, setCounts] = useState({ products: 0, customers: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          getProductCount(),
          getCustomerCount(),
          getOrderCount(),
        ]);

        setCounts({
          products: productsRes.data || 0,
          customers: customersRes.data || 0,
          orders: ordersRes.data || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{counts.products}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{counts.customers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{counts.orders}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
