import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef } = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#fff5f3] via-white to-[#fff9f7]">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-64 h-64 bg-[#ff4b2f]/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#ff4b2f]/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#ff8a65]/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div
            ref={contentRef}
            className={`space-y-6 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
              <span className="w-2 h-2 bg-[#ff4b2f] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#333]">New Collection 2024</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-[1.1] text-black">
              Elevate Your{' '}
              <span className="text-gradient">Everyday</span>{' '}
              Style
            </h1>

            <p className="text-lg text-[#555] max-w-lg leading-relaxed">
              Discover curated collections that blend comfort with contemporary design. 
              Free shipping on orders over $50.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#products"
                className="btn-primary group animate-pulse-glow"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#categories"
                className="btn-secondary"
              >
                Explore Categories
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-black">50K+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-black">10K+</p>
                <p className="text-sm text-gray-500">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-black">4.9</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div
            ref={imageRef}
            className={`relative transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:max-w-none">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-[#ff4b2f]/20 rounded-lg -z-10" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#ff4b2f]/10 rounded-full -z-10" />
              
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src="/images/hero-model.jpg"
                  alt="Fashion model wearing StyleStore clothing"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-float">
                  <p className="text-sm font-medium text-gray-600">Starting from</p>
                  <p className="text-2xl font-bold text-[#ff4b2f]">$49.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#ff4b2f] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
