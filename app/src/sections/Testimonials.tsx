import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { testimonials as fallbackTestimonials } from '@/data/products';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { usePublicApi } from '@/hooks/usePublicApi';
import type { Testimonial } from '@/types';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const apiTestimonials = usePublicApi<Testimonial[]>('/reviews', fallbackTestimonials);
  const testimonials = apiTestimonials.length > 0 ? apiTestimonials : fallbackTestimonials;

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-white overflow-hidden" ref={sectionRef}>
      <div className="container-custom">
        {/* Header */}
        <div 
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-sm font-medium text-[#ff4b2f] tracking-wider uppercase mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-black">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div 
          className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Quote Icon */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#ff4b2f]/10 rounded-full flex items-center justify-center animate-float">
            <Quote className="w-8 h-8 text-[#ff4b2f]" />
          </div>

          {/* Cards Container */}
          <div className="relative h-[300px] md:h-[250px]">
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-all duration-500 ${
                    isActive 
                      ? 'opacity-100 scale-100 z-10' 
                      : 'opacity-0 scale-95 z-0'
                  }`}
                >
                  <div className="bg-[#f9f9f9] rounded-2xl p-8 md:p-10 h-full flex flex-col items-center text-center">
                    {/* Avatar */}
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md mb-4"
                    />
                    
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Text */}
                    <p className="text-lg text-[#555] leading-relaxed mb-6 max-w-2xl">
                      "{testimonial.text}"
                    </p>
                    
                    {/* Name */}
                    <p className="font-semibold text-black">{testimonial.name}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#ff4b2f] hover:border-[#ff4b2f] hover:text-white transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-[#ff4b2f] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#ff4b2f] hover:border-[#ff4b2f] hover:text-white transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
