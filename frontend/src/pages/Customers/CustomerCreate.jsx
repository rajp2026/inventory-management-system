import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, Link } from 'react-router-dom';
import { createCustomer } from '../../api/customerApi';

export default function CustomerCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      await createCustomer(data);
      navigate("/customers");
    } catch (error) {
      console.error("Create customer error:", error);
      setApiError(error.response?.data?.message || "Failed to create customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/customers" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Customer</h1>
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
              {...register("full_name", { 
                required: "Full name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" }
              })}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Jane Doe"
            />
            {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., jane@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              {...register("phone", { 
                required: "Phone number is required",
                minLength: { value: 10, message: "Phone number must be at least 10 digits" }
              })}
              className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 555-0198"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              to="/customers"
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
