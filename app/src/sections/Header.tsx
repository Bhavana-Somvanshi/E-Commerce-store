import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { navLinks } from '@/data/products';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { totalItems, items, totalPrice, updateQuantity, removeFromCart, clearCart, isCartOpen, setIsCartOpen } =
    useCart();
  const { user, authFetch } = useCustomerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0) {
      return;
    }

    if (!user) {
      setIsCartOpen(false);
      navigate('/login', { state: { from: '/account' } });
      return;
    }

    if (shippingAddress.trim().length < 10) {
      setCheckoutError('Enter a valid shipping address before placing the order.');
      return;
    }

    setCheckoutError(null);
    setIsCheckingOut(true);

    try {
      const response = await authFetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: shippingAddress.trim(),
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message || 'Unable to complete checkout.');
      }

      clearCart();
      setShippingAddress('');
      setIsCartOpen(false);
      navigate('/account');
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Unable to complete checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-effect shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <a href="#" className="text-2xl font-bold text-black tracking-tight hover:opacity-80 transition-opacity">
            StyleStore
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-[#333] hover:text-[#ff4b2f] transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#ff4b2f] transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to={user ? '/account' : '/login'}
              className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-medium text-[#333] border border-gray-200 rounded-full hover:border-[#ff4b2f] hover:text-[#ff4b2f] transition-colors"
            >
              {user ? 'My Account' : 'Sign In'}
            </Link>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5 text-[#333]" />
            </button>

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-black/5 rounded-full transition-colors relative" aria-label="Cart">
                  <ShoppingBag className="w-5 h-5 text-[#333]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff4b2f] text-white text-xs font-medium rounded-full flex items-center justify-center animate-scale-in">
                      {totalItems}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold">Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
                      <p className="text-sm text-gray-400 mt-1">Add some items to get started</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto space-y-4 pr-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                              <p className="text-[#ff4b2f] font-semibold mt-1">${item.price.toFixed(2)}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center bg-white rounded border hover:border-[#ff4b2f] transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center bg-white rounded border hover:border-[#ff4b2f] transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 mt-4 space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700">
                            Shipping Address
                          </label>
                          <textarea
                            id="shipping-address"
                            rows={3}
                            value={shippingAddress}
                            onChange={(event) => setShippingAddress(event.target.value)}
                            placeholder="Street, city, state, postal code"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20 focus:border-[#ff4b2f]"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-xl font-semibold">${totalPrice.toFixed(2)}</span>
                        </div>
                        {checkoutError && (
                          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {checkoutError}
                          </p>
                        )}
                        <button
                          onClick={handleCheckout}
                          disabled={isCheckingOut}
                          className="w-full btn-primary py-4 disabled:opacity-60"
                        >
                          {isCheckingOut ? 'Placing order...' : 'Checkout'}
                        </button>
                        <p className="text-xs text-center text-gray-400">
                          Orders are saved to your account after checkout.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <button
              className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#333]" /> : <Menu className="w-5 h-5 text-[#333]" />}
            </button>
          </div>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
          <nav className="flex flex-col gap-2 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-2 px-4 text-[#333] hover:bg-black/5 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to={user ? '/account' : '/login'}
              className="py-2 px-4 text-[#333] hover:bg-black/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {user ? 'My Account' : 'Sign In'}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
