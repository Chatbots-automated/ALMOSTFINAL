import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('Nepavyko išsiųsti slaptažodžio atstatymo laiško. Patikrinkite el. pašto adresą.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-elida-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Link
          to="/signin"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-elida-gold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Grįžti į prisijungimą
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-elida-gold/10 rounded-lg">
              <Shield className="h-6 w-6 text-elida-gold" />
            </div>
            <h2 className="text-2xl font-playfair text-gray-900">
              Slaptažodžio atstatymas
            </h2>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Laiškas išsiųstas!
              </h3>
              <p className="text-gray-600 mb-6">
                Patikrinkite savo el. paštą ir sekite instrukcijas slaptažodžio atstatymui.
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-6 py-3 bg-elida-gold text-white rounded-xl font-medium 
                         hover:bg-elida-accent transition-all duration-300"
              >
                Grįžti į prisijungimą
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleResetPassword}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 rounded-xl text-red-600 text-sm flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  El. pašto adresas
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-gray-200 
                             focus:ring-2 focus:ring-elida-gold focus:border-transparent
                             placeholder-gray-400 transition-all duration-300"
                    placeholder="jusu@pastas.lt"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl font-medium 
                         hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Siunčiama...
                  </>
                ) : (
                  'Siųsti atstatymo laišką'
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}