import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../services/paymentService';
import { 
  CreditCard, 
  Truck, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Shield, 
  Loader2, 
  ArrowLeft, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CheckoutForm>({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-elida-cream pt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-playfair text-gray-900 mb-4">Jūsų krepšelis tuščias</h2>
            <p className="text-gray-600 mb-8">Pridėkite prekių į krepšelį, kad galėtumėte tęsti</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              Peržiūrėti prekes
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderRef = `ORD-${Date.now()}`;
      const baseUrl = window.location.origin;

      const paymentUrl = await createTransaction({
        amount: getCartTotal(),
        reference: orderRef,
        email: form.email,
        returnUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/payment-failed`,
        notificationUrl: `${baseUrl}/api/payment-notification`
      });

      window.location.href = paymentUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Įvyko klaida apdorojant užsakymą. Prašome bandyti dar kartą.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-elida-cream pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-elida-gold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Grįžti į parduotuvę
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-elida-gold/10 rounded-lg">
                <Shield className="h-6 w-6 text-elida-gold" />
              </div>
              <h2 className="text-2xl font-playfair text-gray-900">
                Pristatymo informacija
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <Info className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-elida-gold" />
                  Kontaktinė informacija
                </h3>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    El. paštas *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                             focus:ring-2 focus:ring-elida-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-elida-gold" />
                  Asmeninė informacija
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Vardas *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Pavardė *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-elida-gold" />
                  Pristatymo adresas
                </h3>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresas *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                             focus:ring-2 focus:ring-elida-gold focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Miestas *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pašto kodas *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-elida-gold" />
                  Kontaktinis numeris
                </h3>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefonas *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                             focus:ring-2 focus:ring-elida-gold focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl 
                         font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Apdorojama...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pereiti prie apmokėjimo
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-elida-gold/10 rounded-lg">
                  <Package className="h-6 w-6 text-elida-gold" />
                </div>
                <h2 className="text-2xl font-playfair text-gray-900">
                  Užsakymo santrauka
                </h2>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.imageurl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600">Dydis: {item.selectedSize}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-sm text-gray-600">Spalva: {item.selectedColor}</p>
                      )}
                      <div className="flex justify-between mt-2">
                        <p className="text-sm text-gray-600">Kiekis: {item.quantity}</p>
                        <p className="font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Tarpinė suma</span>
                    <span>€{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Pristatymas</span>
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Nemokamas
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-playfair text-gray-900 pt-2">
                    <span>Viso</span>
                    <span>€{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 text-gray-600">
                <Truck className="h-5 w-5 flex-shrink-0 text-elida-gold" />
                <p className="text-sm">
                  Nemokamas pristatymas visoje Lietuvoje. Pristatymo laikas: 2-4 darbo dienos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}