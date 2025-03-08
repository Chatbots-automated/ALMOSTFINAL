import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Loader2, Shield, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Prašome užpildyti visus laukus');
      return false;
    }
    
    if (isSignUp) {
      if (password.length < 6) {
        setError('Slaptažodis turi būti bent 6 simbolių ilgio');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Slaptažodžiai nesutampa');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/profile');
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(isSignUp 
        ? 'Nepavyko sukurti paskyros. Bandykite dar kartą.' 
        : 'Neteisingas el. paštas arba slaptažodis.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      // Don't navigate here - let the AuthContext handle navigation after redirect
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Šis domenas nėra autorizuotas autentifikacijai. Prašome susisiekti su administratoriumi.');
      } else if (err.code !== 'auth/popup-blocked') {
        setError('Nepavyko prisijungti su Google. Bandykite dar kartą.');
      }
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
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-elida-gold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Grįžti į pagrindinį puslapį
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-elida-gold/10 rounded-lg">
              <Shield className="h-6 w-6 text-elida-gold" />
            </div>
            <h2 className="text-2xl font-playfair text-gray-900">
              {isSignUp ? 'Registracija' : 'Prisijungimas'}
            </h2>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                El. pašto adresas
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Slaptažodis
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-gray-200 
                           focus:ring-2 focus:ring-elida-gold focus:border-transparent
                           placeholder-gray-400 transition-all duration-300"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Pakartokite slaptažodį
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-gray-200 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent
                               placeholder-gray-400 transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSignUp && (
              <div className="flex justify-end">
                <Link
                  to="/password-reset"
                  className="text-sm text-elida-gold hover:text-elida-accent transition-colors"
                >
                  Pamiršote slaptažodį?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl font-medium 
                       hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isSignUp ? 'Kuriama paskyra...' : 'Jungiamasi...'}
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Registruotis
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Prisijungti
                    </>
                  )}
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">arba</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium 
                       hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Tęsti su Google
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-gray-600 hover:text-elida-gold transition-colors"
            >
              {isSignUp ? 'Jau turite paskyrą? Prisijunkite' : 'Neturite paskyros? Registruokitės'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}