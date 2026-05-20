import { Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { usePublicApi } from '@/hooks/usePublicApi';
import type { BlogPost } from '@/types';

export default function BlogArticle() {
  const { id } = useParams<{ id: string }>();
  const post = usePublicApi<Partial<BlogPost> | null>(id ? `/blogs/${id}` : '/blogs/invalid', null);

  if (!id) {
    return null;
  }

  const normalizedPost = post
    ? {
        id: String(post.id),
        title: post.title ?? 'Article',
        excerpt: post.excerpt ?? '',
        content: post.content ?? post.excerpt ?? '',
        image: post.image ?? '/images/blog-wardrobe.jpg',
        category: post.category ?? 'Journal',
        date:
          post.date ??
          new Date(post.created_at ?? '2024-01-01T00:00:00.000Z').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
      }
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f9f9f9] pt-32 pb-16">
        <div className="container-custom">
          {!normalizedPost ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
              Article not found.
            </div>
          ) : (
            <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="aspect-[16/8] overflow-hidden bg-gray-50">
                <img src={normalizedPost.image} alt={normalizedPost.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-[#ff4b2f]/10 px-3 py-1 font-medium text-[#ff4b2f]">
                    {normalizedPost.category}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {normalizedPost.date}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight text-black">
                  {normalizedPost.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-gray-500">{normalizedPost.excerpt}</p>

                <div className="mt-8 space-y-4 text-base leading-8 text-gray-700">
                  {normalizedPost.content
                    .split(/\n+/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>

                <div className="mt-10">
                  <Link to="/blog" className="btn-secondary">
                    View All Posts
                  </Link>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
