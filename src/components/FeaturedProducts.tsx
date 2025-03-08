import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { fetchProducts } from '../services/productService';
import { Product } from '../types/product';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        // Get 4 random products for featured section
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-elida-gold"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-elida-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-playfair text-4xl text-gray-900 mb-6">
              Populiariausios Prekės
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Atraskite mūsų labiausiai vertinamus produktus tobulam įdegiui pasiekti
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <ShoppingBag className="h-5 w-5" />
            Visos Prekės
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}