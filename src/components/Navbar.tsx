import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, ExternalLink, UserCircle2, ShoppingBag, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Cart from './Cart';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart, wishlist } = useStore();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Paslaugos', path: '/services' },
    { name: 'Galerija', path: '/gallery' },
    { name: 'Prekės', path: '/products' },
    { name: 'Rezervuoti', path: '/booking' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-gold' 
            : isHomePage
              ? 'bg-transparent'
              : 'bg-white/95 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                src="/elida-logo.svg" 
                alt="ÉLIDA" 
                className={`h-16 transition-all duration-300 ${
                  (isScrolled || !isHomePage) ? 'brightness-100' : 'brightness-0 invert'
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-lato text-sm uppercase tracking-wider transition-all duration-300 ${
                    location.pathname === link.path
                      ? (isScrolled || !isHomePage) ? 'text-elida-gold font-medium' : 'text-white font-medium'
                      : (isScrolled || !isHomePage) ? 'text-gray-600 hover:text-elida-gold' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                        (isScrolled || !isHomePage) ? 'bg-elida-gold' : 'bg-white'
                      }`}
                      initial={false}
                    />
                  )}
                </Link>
              ))}
              <a
                href="https://jp.lt/panevezyje-pristatyta-nauja-soliariumu-studija-elida-svara-estetika-bronzinis-idegis1/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 font-lato text-sm uppercase tracking-wider transition-all duration-300 ${
                  (isScrolled || !isHomePage) ? 'text-gray-600 hover:text-elida-gold' : 'text-gray-200 hover:text-white'
                }`}
              >
                Apie mus
                <ExternalLink className="h-3 w-3" />
              </a>

              {/* Wishlist Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/wishlist"
                  className={`relative p-2 rounded-full transition-all duration-300 ${
                    (isScrolled || !isHomePage) 
                      ? 'text-gray-600 hover:text-elida-gold' 
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  <Heart className="h-6 w-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-elida-gold text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Shopping Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  (isScrolled || !isHomePage) 
                    ? 'text-gray-600 hover:text-elida-gold' 
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                <ShoppingBag className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-elida-gold text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </motion.button>

              {user ? (
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/profile"
                      className={`flex items-center gap-2 p-2 rounded-full transition-all duration-300 ${
                        (isScrolled || !isHomePage) 
                          ? 'text-gray-600 hover:text-elida-gold' 
                          : 'text-gray-200 hover:text-white'
                      }`}
                    >
                      <UserCircle2 className="h-6 w-6" />
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(212, 175, 55, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                      (isScrolled || !isHomePage) 
                        ? 'bg-elida-gold/10 text-elida-gold hover:bg-elida-gold hover:text-white'
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Atsijungti</span>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/signin"
                    className={`flex items-center gap-2 px-7 py-2.5 rounded-full transition-all duration-300 ${
                      (isScrolled || !isHomePage) 
                        ? 'bg-gradient-to-r from-elida-gold to-elida-accent text-white shadow-gold hover:shadow-gold-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-medium tracking-wide">Prisijungti</span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              {/* Mobile Wishlist Button */}
              <Link
                to="/wishlist"
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  (isScrolled || !isHomePage) 
                    ? 'text-gray-600 hover:text-elida-gold' 
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                <Heart className="h-6 w-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-elida-gold text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Mobile Shopping Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  (isScrolled || !isHomePage) 
                    ? 'text-gray-600 hover:text-elida-gold' 
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                <ShoppingBag className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-elida-gold text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md transition-colors ${
                  (isScrolled || !isHomePage) 
                    ? 'text-gray-600 hover:text-elida-gold hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="px-4 pt-2 pb-4 space-y-1"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === link.path
                          ? 'text-elida-gold bg-elida-gold/10'
                          : 'text-gray-600 hover:text-elida-gold hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 + 0.2 }}
                >
                  <a
                    href="https://jp.lt/panevezyje-pristatyta-nauja-soliariumu-studija-elida-svara-estetika-bronzinis-idegis1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-elida-gold hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Apie mus
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </motion.div>
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 1) * 0.1 + 0.2 }}
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-elida-gold hover:bg-gray-50"
                      >
                        <UserCircle2 className="h-5 w-5" />
                        Mano Profilis
                      </Link>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 2) * 0.1 + 0.2 }}
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-elida-gold hover:bg-elida-gold/10 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Atsijungti</span>
                      </div>
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.1 + 0.2 }}
                  >
                    <Link
                      to="/signin"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center mt-4 px-6 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium transition-colors duration-300 shadow-gold"
                    >
                      Prisijungti
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Shopping Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}