import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, LogOut, Loader2, Shield, CheckCircle, Calendar, ShoppingBag, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserBookings } from '../services/bookingService';
import { fetchUserOrders } from '../services/orderService';
import { Booking } from '../types/booking';
import { format } from 'date-fns';
import { lt } from 'date-fns/locale';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const loadUserData = async () => {
      try {
        setLoading(true);
        const [userBookings, userOrders] = await Promise.all([
          getUserBookings(user.uid),
          fetchUserOrders(user.uid)
        ]);

        // Sort bookings by date, most recent first
        setBookings(userBookings.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));

        // Sort orders by creation date, most recent first
        setOrders(userOrders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Nepavyko užkrauti jūsų istorijos. Prašome bandyti vėliau.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      // Here you would update the user's profile
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-20">
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
              Mano Paskyra
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto mb-8"></div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden lg:col-span-1"
            >
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Profilis atnaujintas</span>
                </motion.div>
              )}

              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-elida-gold/10 rounded-lg">
                  <Shield className="h-6 w-6 text-elida-gold" />
                </div>
                <h2 className="text-2xl font-playfair text-gray-900">
                  Profilio Informacija
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vardas
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl ${
                        isEditing
                          ? 'bg-white border border-elida-gold/20 focus:ring-2 focus:ring-elida-gold focus:border-transparent'
                          : 'bg-gray-50 border border-gray-200'
                      } transition-all duration-300`}
                    />
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-elida-gold transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    El. paštas
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-end gap-4 pt-4"
                  >
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Atšaukti
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={updating}
                      className="px-6 py-2 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl font-medium 
                               hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Atnaujinama...
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4" />
                          Išsaugoti pakeitimus
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                <div className="pt-8 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium 
                             hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Atsijungti
                  </button>
                </div>
              </div>
            </motion.div>

            {/* History Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {loading ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-elida-gold animate-spin" />
                </div>
              ) : (
                <>
                  {/* Bookings History */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-elida-gold/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-elida-gold" />
                      </div>
                      <h2 className="text-2xl font-playfair text-gray-900">
                        Rezervacijų Istorija
                      </h2>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Jūs dar neturite rezervacijų</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-elida-gold" />
                                <h3 className="font-medium text-gray-900">
                                  {format(new Date(booking.date), 'PPP', { locale: lt })}
                                </h3>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                                {booking.status === 'confirmed' ? 'Patvirtinta' :
                                 booking.status === 'cancelled' ? 'Atšaukta' : 'Įvykdyta'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                              <span>Laikas: {booking.time}</span>
                              <ChevronRight className="h-5 w-5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Orders History */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-elida-gold/10 rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-elida-gold" />
                      </div>
                      <h2 className="text-2xl font-playfair text-gray-900">
                        Užsakymų Istorija
                      </h2>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Jūs dar neturite užsakymų</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <ShoppingBag className="h-5 w-5 text-elida-gold" />
                                <h3 className="font-medium text-gray-900">
                                  Užsakymas #{order.id.slice(-6)}
                                </h3>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${getOrderStatusColor(order.status)}`}>
                                {order.status === 'completed' ? 'Įvykdytas' :
                                 order.status === 'processing' ? 'Vykdomas' :
                                 order.status === 'cancelled' ? 'Atšauktas' : 'Laukiama'}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-gray-600">
                                <span>Data: {format(new Date(order.createdAt), 'PPP', { locale: lt })}</span>
                                <span className="font-medium text-gray-900">€{order.total.toFixed(2)}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                Prekės: {order.items.length}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}