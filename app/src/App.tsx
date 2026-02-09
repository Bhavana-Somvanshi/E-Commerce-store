import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
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
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/*" element={<AdminRouter />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
