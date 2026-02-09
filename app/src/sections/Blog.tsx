import { ArrowRight, Calendar } from 'lucide-react';
import { blogPosts } from '@/data/products';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Blog() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const featuredPost = blogPosts.find((p) => p.featured);
  const regularPosts = blogPosts.filter((p) => !p.featured);

  return (
    <section id="blog" className="section-padding bg-[#f9f9f9]" ref={sectionRef}>
      <div className="container-custom">
        {/* Header */}
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
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-[#ff4b2f] font-medium hover:gap-3 transition-all group"
          >
            View All Posts
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Blog Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Post */}
          {featuredPost && (
            <a
              href="#"
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
                <p className="text-white/80 mb-4 line-clamp-2">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calendar className="w-4 h-4" />
                  {featuredPost.date}
                </div>
              </div>
            </a>
          )}

          {/* Regular Posts */}
          {regularPosts.map((post, index) => (
            <a
              key={post.id}
              href="#"
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
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
