import { Link, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const { getProductById } = useAdmin();
  const product = id ? getProductById(id) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">
          Update an existing product listing.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {product ? (
          <>
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="text-lg font-semibold text-gray-900">{product.name}</p>
            </div>
            <p className="text-sm text-gray-600">
              This page is ready for an edit form.
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            We could not find a product for id {id}.
          </p>
        )}
        <div>
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
