import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Products from './pages/Products';
import SignIn from './components/SignIn';
import AuthCallback from './pages/AuthCallback';
import Footer from './components/Footer';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import PasswordReset from './pages/PasswordReset';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-elida-cream font-lato">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/products" element={<Products />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;