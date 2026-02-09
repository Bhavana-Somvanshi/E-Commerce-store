import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const brands = [
  { name: 'VOGUE', id: 1 },
  { name: 'ELLE', id: 2 },
  { name: 'HARPER\'S', id: 3 },
  { name: 'GQ', id: 4 },
  { name: 'INSTYLE', id: 5 },
];

export default function BrandPartners() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-12 bg-white overflow-hidden" ref={ref}>
      <div className="container-custom">
        <p 
          className={`text-center text-sm text-gray-500 mb-8 transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Trusted by Industry Leaders
        </p>
      </div>
      
      {/* Infinite scroll container */}
      <div 
        className={`relative transition-all duration-800 delay-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        {/* Scrolling track */}
        <div className="flex animate-infinite-scroll">
          {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 px-12 py-4"
            >
              <span className="text-2xl font-bold text-gray-300 hover:text-gray-600 transition-colors duration-300 cursor-default tracking-widest">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
