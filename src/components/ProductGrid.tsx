import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/product';
import { Search, Target, Crosshair } from 'lucide-react';
import { fetchProducts } from '../services/productService';
import { motion } from 'framer-motion';

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Visi');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Nepavyko užkrauti produktų. Prašome bandyti vėliau.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = ['Visi', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Visi' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-elida-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Ieškoti produktų..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/80 backdrop-blur-sm border border-elida-gold/20 focus:ring-2 focus:ring-elida-gold focus:border-transparent shadow-inner"
              />
              <Crosshair className="absolute left-4 top-1/2 transform -translate-y-1/2 text-elida-gold h-5 w-5" />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-elida-gold/90 backdrop-blur-sm text-white rounded-lg hover:bg-elida-gold transition-colors shadow-md"
          >
            <Target className="h-5 w-5" />
            Filtruoti produktus
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-elida-gold/20 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-elida-gold">Kategorijos</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm border ${
                        selectedCategory === category
                          ? 'bg-elida-gold text-white border-elida-gold'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      } transition-colors shadow-sm`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-elida-gold">Kainų intervalas</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full accent-elida-gold"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-elida-gold"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0]}€</span>
                    <span>{priceRange[1]}€</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-elida-gold/20">
          <Target className="h-16 w-16 text-elida-gold/20 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Produktų pagal pasirinktus kriterijus nerasta.</p>
        </div>
      )}
    </div>
  );
}