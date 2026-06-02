import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getProductCount, deleteProduct } from '../../api/productApi';
import Table from '../../components/Table';
import Loader from '../../components/Loader';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listRes, countRes] = await Promise.all([
        getProducts(1, 100), // simplistic pagination for now
        getProductCount()
      ]);
      setProducts(listRes.data || []);
      setTotalCount(countRes.data || 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchData(); // Refresh list
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product. " + (error.response?.data?.message || ""));
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'price', label: 'Price ($)' },
    { key: 'stock_quantity', label: 'Stock' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-3">
          <Link to={`/products/${row.id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors">Edit</Link>
          <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900 font-medium transition-colors">Delete</button>
        </div>
      )
    }
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Total products: {totalCount}</p>
        </div>
        <Link 
          to="/products/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm text-center"
        >
          + Add New Product
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No products found. Start by creating one!</p>
        </div>
      ) : (
        <Table columns={columns} data={products} />
      )}
    </div>
  );
};
export default ProductList;
