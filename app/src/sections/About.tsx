import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function About() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="about" className="section-padding bg-[#f9f9f9]" ref={sectionRef}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div 
            className={`relative transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative">
              {/* Decorative line */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-[#ff4b2f]/30" />
              
              <div className="overflow-hidden rounded-2xl shadow-xl group">
                <img
                  src="/images/about-team.jpg"
                  alt="Our team collaborating"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Decorative line */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-[#ff4b2f]/30" />
            </div>
          </div>

          {/* Content */}
          <div 
            className={`space-y-6 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <span className="inline-block text-sm font-medium text-[#ff4b2f] tracking-wider uppercase">
              About Us
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-black leading-tight">
              Crafting Quality Since 2010
            </h2>
            
            <div className="space-y-4 text-[#555] leading-relaxed">
              <p>
                We believe in the power of thoughtful design. Every product in our collection 
                is carefully selected to bring both beauty and functionality to your daily life.
              </p>
              <p>
                Our commitment to sustainability means we partner with ethical manufacturers 
                who share our values. From sourcing materials to packaging, we strive to 
                minimize our environmental impact.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#ff4b2f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#ff4b2f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-black">Quality First</p>
                  <p className="text-sm text-gray-500">Premium materials</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#ff4b2f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#ff4b2f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-black">Sustainable</p>
                  <p className="text-sm text-gray-500">Eco-friendly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#ff4b2f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#ff4b2f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-black">Fast Shipping</p>
                  <p className="text-sm text-gray-500">Worldwide delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#ff4b2f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#ff4b2f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-black">24/7 Support</p>
                  <p className="text-sm text-gray-500">Always here</p>
                </div>
              </div>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#ff4b2f] font-medium hover:gap-3 transition-all group"
            >
              Learn Our Story
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
