import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCustomer, updateCustomer } from '../../api/customerApi';
import Loader from '../../components/Loader';

export default function CustomerEdit() {
  const { id } = useParams();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomer(id);
        reset(res.data);
      } catch (error) {
        console.error("Failed to fetch customer:", error);
        setApiError("Failed to load customer details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      await updateCustomer(id, data);
      navigate("/customers");
    } catch (error) {
      console.error("Update customer error:", error);
      setApiError(error.response?.data?.message || "Failed to update customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/customers" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Customer</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register("full_name", { required: "Full name is required", minLength: 2 })}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
              })}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              {...register("phone", { required: "Phone number is required", minLength: 10 })}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link to="/customers" className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-70">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
