import { ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CTA() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-20 bg-[#ff4b2f] relative overflow-hidden" ref={sectionRef}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div 
            className={`text-center lg:text-left transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-[48px] font-semibold text-white leading-tight mb-6">
              Ready to Transform Your Style?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto lg:mx-0">
              Join thousands of satisfied customers. Free shipping on your first order 
              over $50. Start your style journey today.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#ff4b2f] font-semibold rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg group"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 transition-all duration-300 hover:bg-white/10"
              >
                Learn More
              </a>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start">
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div 
            className={`hidden lg:block transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-3xl transform rotate-3" />
              <img
                src="/images/hero-model.jpg"
                alt="Fashion model"
                className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
