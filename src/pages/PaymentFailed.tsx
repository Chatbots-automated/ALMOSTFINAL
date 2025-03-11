import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-elida-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-elida-gold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Grįžti į pagrindinį puslapį
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="h-12 w-12 text-red-500" />
          </motion.div>

          <h2 className="text-2xl font-playfair text-gray-900 mb-4">
            Mokėjimas nepavyko
          </h2>
          
          <p className="text-gray-600 mb-8">
            Įvyko klaida apdorojant jūsų mokėjimą. Prašome bandyti dar kartą.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl font-medium 
                       hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Bandyti dar kartą
            </button>

            <Link
              to="/"
              className="block w-full py-3 bg-white text-elida-gold border border-elida-gold/20 rounded-xl font-medium 
                       hover:bg-elida-gold/5 transition-all duration-300"
            >
              Grįžti į pagrindinį puslapį
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}