import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getProductCount, deleteProduct } from '../../api/productApi';
import Table from '../../components/Table';
import Loader from '../../components/Loader';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const [listRes, countRes] = await Promise.all([
        getProducts(page, limit),
        getProductCount()
      ]);
      setProducts(listRes.data || []);
      setTotalPages(listRes.meta?.total_pages || 1);
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
        // If we deleted the last item on this page, go back a page
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchData(currentPage);
        }
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

  // Only show full screen loader on initial load
  if (loading && products.length === 0) return <Loader />;

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
      
      {products.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No products found. Start by creating one!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          {/* Overlay loader when changing pages */}
          {loading && products.length > 0 && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
            </div>
          )}
          
          <Table columns={columns} data={products} />
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProductList;
