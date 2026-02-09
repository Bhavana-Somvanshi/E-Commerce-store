import { Link } from 'react-router-dom';

export default function NewProduct() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <p className="text-gray-500 mt-1">
          Create a new product listing.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-sm text-gray-600">
          This page is ready for a product creation form.
        </p>
        <div className="mt-4">
          <Link
            to="/admin/products"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
