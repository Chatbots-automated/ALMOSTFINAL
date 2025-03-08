import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Įvyko klaida siunčiant žinutę. Prašome bandyti vėliau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-b from-elida-peach to-elida-cream py-16 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              Susisiekite su mumis
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Turite klausimų? Susisiekite su mumis ir mes mielai jums padėsime
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              <h2 className="font-playfair text-3xl text-gray-900 mb-8">Kontaktinė informacija</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="p-3 bg-elida-gold/10 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-elida-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Adresas</h3>
                    <p className="text-gray-600">Vilniaus g. 23A, Panevėžys</p>
                    <p className="text-gray-600">LT-36234, Lietuva</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-elida-gold/10 rounded-lg mr-4">
                    <Phone className="h-6 w-6 text-elida-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Telefonas</h3>
                    <p className="text-gray-600">(0-644) 40596</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-elida-gold/10 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-elida-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">El. paštas</h3>
                    <p className="text-gray-600">info@elida.lt</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Darbo laikas</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Pirmadienis - Penktadienis</span>
                    <span>9:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Šeštadienis</span>
                    <span>9:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sekmadienis</span>
                    <span>9:00 - 14:00</span>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Įmonės informacija</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Simona Dilė IĮ</p>
                  <p>Įmonės kodas: 306722261</p>
                  <p>Danutės g. 43-37, LT-36234 Panevėžys</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              <h2 className="font-playfair text-3xl text-gray-900 mb-8">Parašykite mums</h2>
              
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-100 rounded-xl p-6 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Žinutė išsiųsta!</h3>
                  <p className="text-gray-600">
                    Dėkojame už jūsų žinutę. Susisieksime su jumis kuo greičiau.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Vardas Pavardė *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent
                               placeholder-gray-400 transition-all duration-300"
                      placeholder="Jūsų vardas ir pavardė"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      El. paštas *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent
                               placeholder-gray-400 transition-all duration-300"
                      placeholder="jusu@pastas.lt"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Žinutė *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent
                               placeholder-gray-400 transition-all duration-300"
                      placeholder="Jūsų žinutė..."
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl font-medium 
                             shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Siunčiama...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Siųsti žinutę
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.739796652015!2d24.368656577698104!3d55.727241893958706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e6321421e889d5%3A0x5e966abcd248574d!2zVmlsbmlhdXMgZy4gMjNBLCBQYW5ldsSXxb95cywgMzUyMDMgUGFuZXbEl8W-aW8gbS4gc2F2Lg!5e1!3m2!1sen!2slt!4v1740256043556!5m2!1sen!2slt"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}