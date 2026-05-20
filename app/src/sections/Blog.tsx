import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { usePublicApi } from '@/hooks/usePublicApi';
import type { BlogPost } from '@/types';

export default function Blog() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const apiPosts = usePublicApi<Partial<BlogPost>[]>('/blogs', []);
  const normalizedPosts = apiPosts.map((post, index) => ({
    ...post,
    date:
      post.date ??
      new Date(post.created_at ?? '2024-01-01T00:00:00.000Z').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    featured: post.featured ?? index === 0,
  })) as BlogPost[];
  const featuredPost = normalizedPosts.find((p) => p.featured);
  const regularPosts = normalizedPosts.filter((p) => !p.featured);

  return (
    <section id="blog" className="section-padding bg-[#f9f9f9]" ref={sectionRef}>
      <div className="container-custom">
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <span className="inline-block text-sm font-medium text-[#ff4b2f] tracking-wider uppercase mb-3">
              From The Journal
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-black">
              Latest Articles
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#ff4b2f] font-medium hover:gap-3 transition-all group"
          >
            View All Posts
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {normalizedPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
            No blog posts published yet.
          </div>
        ) : normalizedPosts.length === 1 && featuredPost ? (
          <Link
            to={`/blog/${featuredPost.id}`}
            className={`group relative block overflow-hidden rounded-3xl aspect-[16/9] transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
              <span className="mb-4 inline-block rounded-full bg-[#ff4b2f] px-3 py-1 text-xs font-medium text-white">
                {featuredPost.category}
              </span>
              <h3 className="mb-3 max-w-3xl text-2xl font-semibold text-white transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                {featuredPost.title}
              </h3>
              <p className="mb-4 max-w-2xl text-white/85 line-clamp-3">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar className="h-4 w-4" />
                {featuredPost.date}
              </div>
            </div>
          </Link>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {featuredPost && (
              <Link
                to={`/blog/${featuredPost.id}`}
                className={`group relative overflow-hidden rounded-2xl aspect-[16/10] lg:aspect-auto lg:row-span-2 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block px-3 py-1 bg-[#ff4b2f] text-white text-xs font-medium rounded-full mb-4">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
                    {featuredPost.title}
                  </h3>
                  <p className="text-white/80 mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                </div>
              </Link>
            )}

            {regularPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className={`group flex flex-col sm:flex-row gap-4 bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' }}
              >
                <div className="sm:w-2/5 aspect-[3/2] sm:aspect-auto overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="flex-1 p-5 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3 w-fit">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-[#ff4b2f] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
