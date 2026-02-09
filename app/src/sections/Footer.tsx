import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '#' },
    { label: 'Best Sellers', href: '#' },
    { label: 'Sale', href: '#' },
    { label: 'Gift Cards', href: '#' },
  ],
  support: [
    { label: 'Contact Us', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'Shipping Info', href: '#' },
    { label: 'Returns', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Sustainability', href: '#' },
  ],
};

export default function Footer() {
  const { ref: footerRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <footer className="bg-[#f9f9f9] pt-16 pb-8" ref={footerRef}>
      <div className="container-custom">
        {/* Main Footer */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-200 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="#" className="text-2xl font-bold text-black tracking-tight">
              StyleStore
            </a>
            <p className="text-sm text-gray-500 mt-4 max-w-xs">
              Curated fashion that blends comfort with contemporary design. 
              Quality meets sustainability.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-[#ff4b2f] hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-[#ff4b2f] hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-[#ff4b2f] hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-black mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-[#ff4b2f] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-black mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-[#ff4b2f] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-black mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-[#ff4b2f] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-black mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>hello@stylestore.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Fashion Ave<br />New York, NY 10001</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-gray-400">
            © 2024 StyleStore. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-[#ff4b2f] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-[#ff4b2f] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-[#ff4b2f] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
