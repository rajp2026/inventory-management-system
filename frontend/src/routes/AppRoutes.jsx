import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import Dashboard from '../pages/Dashboard/Dashboard';
import ProductList from '../pages/Products/ProductList';
import ProductCreate from '../pages/Products/ProductCreate';
import ProductEdit from '../pages/Products/ProductEdit';
import CustomerList from '../pages/Customers/CustomerList';
import CustomerCreate from '../pages/Customers/CustomerCreate';
import CustomerEdit from '../pages/Customers/CustomerEdit';
import OrderList from '../pages/Orders/OrderList';
import OrderCreate from '../pages/Orders/OrderCreate';
import OrderDetail from '../pages/Orders/OrderDetail';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />

        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/create" element={<CustomerCreate />} />
        <Route path="/customers/:id/edit" element={<CustomerEdit />} />

        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/create" element={<OrderCreate />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
