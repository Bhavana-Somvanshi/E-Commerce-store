import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import Header from '@/sections/Header';
import Hero from '@/sections/Hero';
import BrandPartners from '@/sections/BrandPartners';
import About from '@/sections/About';
import FeaturedProducts from '@/sections/FeaturedProducts';
import Categories from '@/sections/Categories';
import Testimonials from '@/sections/Testimonials';
import Blog from '@/sections/Blog';
import CTA from '@/sections/CTA';
import Newsletter from '@/sections/Newsletter';
import Footer from '@/sections/Footer';
import AdminRouter from './admin/AdminRouter';
import LoginPage from '@/pages/Login';
import Account from '@/pages/Account';
import ProductsCatalog from '@/pages/ProductsCatalog';
import BlogCatalog from '@/pages/BlogCatalog';
import BlogArticle from '@/pages/BlogArticle';
import RequireCustomerAuth from '@/RequireCustomerAuth';

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandPartners />
        <About />
        <FeaturedProducts />
        <Categories />
        <Testimonials />
        <Blog />
        <CTA />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CustomerAuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsCatalog />} />
            <Route path="/blog" element={<BlogCatalog />} />
            <Route path="/blog/:id" element={<BlogArticle />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireCustomerAuth />}>
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="/admin/*" element={<AdminRouter />} />
          </Routes>
        </CartProvider>
      </CustomerAuthProvider>
    </BrowserRouter>
  );
}

export default App;
