import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProduct, updateProduct } from '../../api/productApi';
import Loader from '../../components/Loader';

export default function ProductEdit() {
  const { id } = useParams();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(id);
        reset(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setApiError("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity, 10)
      };
      await updateProduct(id, payload);
      navigate("/products");
    } catch (error) {
      console.error("Update product error:", error);
      setApiError(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/products" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              {...register("sku", { required: "SKU is required" })}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number" step="0.01" min="0"
                {...register("price", { required: "Price is required" })}
                className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number" min="0"
                {...register("stock_quantity", { required: "Stock is required" })}
                className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.stock_quantity ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link to="/products" className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-70">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
