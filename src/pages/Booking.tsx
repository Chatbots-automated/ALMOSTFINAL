import React from 'react';
import { motion } from 'framer-motion';
import BookingCalendar from '../components/BookingCalendar';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';

export default function Booking() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@elida.lt'; // Replace with your admin email

  return (
    <div className="pt-24">
      <section className="bg-gradient-to-b from-elida-warm to-elida-cream py-24 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-5xl md:text-6xl text-gray-900 mb-8 leading-tight">
              {isAdmin ? 'Booking Management' : 'Rezervuokite Savo Laiką'}
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed">
              {isAdmin
                ? 'Manage all bookings and view the calendar'
                : 'Pasirinkite jums patogų laiką ir kabiną'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-elida-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isAdmin ? <AdminDashboard /> : <BookingCalendar />}
        </div>
      </section>
    </div>
  );
}