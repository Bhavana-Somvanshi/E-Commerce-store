import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function EditReview() {
  const { id } = useParams<{ id: string }>();
  const { reviews, updateReview } = useAdmin();
  const navigate = useNavigate();
  const review = id ? reviews.find((r) => r.id === id) : undefined;
  const [form, setForm] = useState({
    name: '',
    rating: '5',
    text: '',
    avatar: '',
    published: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!review) return;
    setForm({
      name: review.name,
      rating: String(review.rating),
      text: review.text,
      avatar: review.avatar ?? '',
      published: review.published,
    });
  }, [review]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await updateReview(id, {
        name: form.name.trim(),
        rating: Number(form.rating),
        text: form.text.trim(),
        avatar: form.avatar.trim() || null,
        published: form.published,
      });
      navigate('/admin/reviews');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update review.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Review</h1>
        <p className="text-gray-500 mt-1">Update this review.</p>
      </div>

      {!review ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600">Review not found.</p>
          <div className="mt-4">
            <Link
              to="/admin/reviews"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Reviews
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => updateField('rating', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20"
              >
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Text</label>
              <textarea
                required
                rows={4}
                value={form.text}
                onChange={(e) => updateField('text', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
              <input
                value={form.avatar}
                onChange={(e) => updateField('avatar', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Published</label>
              <select
                value={form.published ? 'true' : 'false'}
                onChange={(e) => updateField('published', e.target.value === 'true')}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20"
              >
                <option value="true">Published</option>
                <option value="false">Hidden</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-[#ff4b2f] text-white rounded-lg hover:bg-[#e63e24] transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Update Review'}
            </button>
            <Link
              to="/admin/reviews"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
