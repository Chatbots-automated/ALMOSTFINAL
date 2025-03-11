import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../services/paymentService';
import { useStore } from '../store/useStore';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useStore();
  const transactionId = searchParams.get('payment_reference');

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!transactionId) {
        navigate('/');
        return;
      }

      try {
        const isValid = await verifyPayment(transactionId);
        if (isValid) {
          clearCart();
        } else {
          navigate('/payment-failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        navigate('/payment-failed');
      }
    };

    verifyTransaction();
  }, [transactionId, navigate, clearCart]);

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
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-12 w-12 text-green-500" />
          </motion.div>

          <h2 className="text-2xl font-playfair text-gray-900 mb-4">
            Mokėjimas sėkmingas!
          </h2>
          
          <p className="text-gray-600 mb-8">
            Jūsų užsakymas buvo sėkmingai apmokėtas. Netrukus gausite patvirtinimo el. laišką.
          </p>

          <div className="space-y-4">
            <Link
              to="/profile"
              className="block w-full py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl font-medium 
                       hover:shadow-lg transition-all duration-300"
            >
              Peržiūrėti užsakymus
            </Link>

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