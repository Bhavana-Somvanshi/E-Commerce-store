import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { usePublicApi } from '@/hooks/usePublicApi';
import type { BlogPost } from '@/types';

export default function BlogCatalog() {
  const posts = usePublicApi<Partial<BlogPost>[]>('/blogs', []);

  const normalizedPosts = posts.map((post, index) => ({
    id: String(post.id),
    title: post.title ?? 'Article',
    excerpt: post.excerpt ?? '',
    image: post.image ?? '/images/blog-wardrobe.jpg',
    category: post.category ?? 'Journal',
    date:
      post.date ??
      new Date(post.created_at ?? '2024-01-01T00:00:00.000Z').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    featured: post.featured ?? index === 0,
  }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f9f9f9] pt-32 pb-16">
        <div className="container-custom space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#ff4b2f]">From The Journal</p>
              <h1 className="text-4xl font-semibold text-black mt-2">All Articles</h1>
              <p className="text-[#555] mt-3 max-w-2xl">
                Browse every published post from the storefront journal.
              </p>
            </div>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>

          {normalizedPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
              No blog posts published yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {normalizedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-50">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {post.category}
                    </span>
                    <h2 className="mt-3 text-xl font-semibold text-black group-hover:text-[#ff4b2f] transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
