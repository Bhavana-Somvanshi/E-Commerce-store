import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { usePublicApi } from '@/hooks/usePublicApi';
import type { Product, Category } from '@/types';

export default function Categories() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const products = usePublicApi<Partial<Product>[]>('/products', []);

  const categories: Category[] = Array.from(
    products.reduce((map, product) => {
      const categoryName = product.category?.trim();
      if (!categoryName) {
        return map;
      }

      const key = categoryName.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.productCount += 1;
        return map;
      }

      map.set(key, {
        id: key,
        name: categoryName,
        image: product.image ?? '/images/category-accessories.jpg',
        productCount: 1,
      });

      return map;
    }, new Map<string, Category>()).values()
  );

  return (
    <section id="categories" className="section-padding bg-[#f9f9f9]" ref={sectionRef}>
      <div className="container-custom">
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <span className="inline-block text-sm font-medium text-[#ff4b2f] tracking-wider uppercase mb-3">
              Browse By
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-black">
              Shop by Category
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[#ff4b2f] font-medium hover:gap-3 transition-all group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
            Categories will appear after products are added.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {categories.map((category, index) => (
              <a
                key={category.id}
                href="#"
                className={`group relative overflow-hidden rounded-2xl aspect-[3/4] transition-all duration-700 hover:-translate-y-2 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/80" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:translate-x-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/70 mb-3">{category.productCount} Products</p>
                  <span className="inline-flex items-center gap-2 text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
