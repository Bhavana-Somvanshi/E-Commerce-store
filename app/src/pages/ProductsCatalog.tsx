import { useMemo, useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { usePublicApi } from '@/hooks/usePublicApi';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export default function ProductsCatalog() {
  const { addToCart, setIsCartOpen } = useCart();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const products = usePublicApi<Partial<Product>[]>('/products', []);

  const normalizedProducts = products.map((product) => ({
    id: String(product.id),
    name: product.name ?? 'Product',
    price: Number(product.price ?? 0),
    image: product.image ?? '/images/product-sneakers.jpg',
    category: product.category ?? 'General',
    rating: Number(product.rating ?? 0),
    reviews: Number(product.reviews ?? 0),
    isNew: product.isNew ?? false,
    isFeatured: product.isFeatured ?? false,
    originalPrice: product.originalPrice,
  }));

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(normalizedProducts.map((product) => product.category)))],
    [normalizedProducts]
  );

  const filteredProducts = normalizedProducts.filter((product) => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f9f9f9] pt-32 pb-16">
        <div className="container-custom space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#ff4b2f]">Storefront</p>
              <h1 className="text-4xl font-semibold text-black mt-2">All Products</h1>
              <p className="text-[#555] mt-3 max-w-2xl">
                Browse the full product catalog, compare ratings, and add your favorites to cart.
              </p>
            </div>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 flex flex-col gap-4 md:flex-row">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20 focus:border-[#ff4b2f]"
            />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20 focus:border-[#ff4b2f]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
              No products match your current filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.isNew && (
                        <span className="px-3 py-1 bg-[#ff4b2f] text-white text-xs font-medium rounded-full">New</span>
                      )}
                      {product.originalPrice && (
                        <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">Sale</span>
                      )}
                    </div>

                    <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#ff4b2f] hover:text-white">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-sm text-gray-500">{product.category}</span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span>({product.reviews})</span>
                      </div>
                    </div>

                    <h2 className="font-medium text-black mb-3 line-clamp-1 group-hover:text-[#ff4b2f] transition-colors">
                      {product.name}
                    </h2>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-semibold text-[#ff4b2f]">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <button onClick={() => handleAddToCart(product)} className="w-full btn-primary py-3 text-sm">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
