import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-white" ref={sectionRef}>
      <div className="container-custom">
        <div 
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-black mb-3">
            Stay in the Loop
          </h3>
          <p className="text-gray-500 mb-8">
            Subscribe for exclusive offers, early access to new arrivals, and style tips.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#ff4b2f] focus:ring-2 focus:ring-[#ff4b2f]/10 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitted}
              className={`px-8 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                isSubmitted
                  ? 'bg-green-500 text-white'
                  : 'bg-[#ff4b2f] text-white hover:bg-[#e63e24] hover:shadow-lg'
              }`}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
