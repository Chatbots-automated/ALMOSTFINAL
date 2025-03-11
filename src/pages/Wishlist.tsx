import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className="pt-24">
      <section className="bg-gradient-to-b from-elida-warm to-elida-cream py-16 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              Išsaugoti Produktai
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Jūsų pamėgti produktai vienoje vietoje
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-playfair text-gray-900 mb-2">
                Jūsų išsaugotų produktų sąrašas tuščias
              </h2>
              <p className="text-gray-600 mb-8">
                Pridėkite produktus paspaudę širdutės ikoną prie produkto
              </p>
              <motion.a
                href="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
              >
                <ShoppingBag className="h-5 w-5" />
                Peržiūrėti produktus
              </motion.a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}