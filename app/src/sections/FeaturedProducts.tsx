import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState } from 'react';

export default function FeaturedProducts() {
  const { addToCart, setIsCartOpen } = useCart();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const featuredProducts = products.filter((p) => p.isFeatured);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <section id="products" className="section-padding bg-white" ref={sectionRef}>
      <div className="container-custom">
        {/* Header */}
        <div 
          className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-sm font-medium text-[#ff4b2f] tracking-wider uppercase mb-3">
            Our Collection
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-black mb-4">
            Featured Products
          </h2>
          <p className="text-[#555] leading-relaxed">
            Handpicked favorites from this season. Each piece is carefully selected 
            for quality, style, and sustainability.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
              }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1 bg-[#ff4b2f] text-white text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                      Sale
                    </span>
                  )}
                </div>

                {/* Wishlist button */}
                <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ff4b2f] hover:text-white">
                  <Heart className="w-4 h-4" />
                </button>

                {/* Quick add button */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${
                    hoveredId === product.id 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-primary py-3 text-sm"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                
                <h3 className="font-medium text-black mb-2 line-clamp-1 group-hover:text-[#ff4b2f] transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-[#ff4b2f]">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div 
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a href="#categories" className="btn-secondary">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
