import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Users, Clock, Sparkles, ChevronDown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const testimonials = [
    {
      name: "Laura K.",
      text: "Puiki aplinka, profesionalus aptarnavimas ir aukščiausios kokybės įranga. Tikrai rekomenduoju!",
      rating: 5
    },
    {
      name: "Tomas M.",
      text: "Geriausias soliariumas Panevėžyje. Visada išeinu su puikiu įdegiu ir gera nuotaika.",
      rating: 5
    },
    {
      name: "Greta P.",
      text: "Labai patogi rezervacijos sistema ir malonus personalas. Visada grįžtu!",
      rating: 5
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute w-full h-full object-cover object-center"
          style={{ objectFit: 'cover', width: '100vw', height: '100vh' }}
        >
          <source src="/IMG_3098.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient Overlay for Better Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block px-5 py-2 bg-elida-gold/20 backdrop-blur-sm text-elida-gold rounded-full text-sm font-medium mb-8 shimmer tracking-wider uppercase"
            >
              Soliariumų studija Panevėžyje
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="font-playfair text-6xl md:text-8xl text-white mb-10 leading-tight"
            >
              Atrask Tobulą
              <br />
              <span className="text-transparent bg-clip-text bg-gold-gradient animate-gradient">Įdegį</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="text-xl text-elida-beige mb-12 max-w-lg leading-relaxed"
            >
              ELIDA - šiuolaikiška vieta Jūsų tobulam įdegiui
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212, 175, 55, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium text-lg shadow-gold hover:shadow-gold-lg transition-all duration-300"
                >
                  Rezervuoti Laiką
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-10 py-4 bg-white/10 text-white backdrop-blur-sm rounded-full font-medium text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Mūsų Paslaugos
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6">
              Kodėl Rinktis <span className="flex items-center justify-center gap-2 inline-block">
                <img 
                  src="/elida-logo.svg" 
                  alt="ÉLIDA" 
                  className="h-12 md:h-16 inline-block"
                />
              </span>?
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: <Sun className="h-10 w-10" />,
                title: "Premium Įranga",
                description: "Naujausi soliariumai su pažangiausiomis technologijomis"
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Profesionalus Aptarnavimas",
                description: "Kvalifikuoti specialistai patars ir padės"
              },
              {
                icon: <Clock className="h-10 w-10" />,
                title: "Patogus Laikas",
                description: "Lankstus darbo grafikas, pritaikytas jūsų poreikiams"
              },
              {
                icon: <Sparkles className="h-10 w-10" />,
                title: "Aukšta Kokybė",
                description: "Premium klasės kosmetika ir priežiūros priemonės"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-elida-cream p-10 rounded-2xl text-center group hover:bg-gradient-to-br from-elida-gold/90 to-elida-accent/90 transition-all duration-500 shadow-md hover:shadow-gold-lg"
              >
                <div className="inline-block p-5 bg-white rounded-xl shadow-md text-elida-gold group-hover:text-white group-hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                  {feature.icon}
                </div>
                <h3 className="font-playfair text-2xl mt-7 mb-4 text-gray-900 group-hover:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/90">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-elida-lavender/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-soft-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6">
              Ką Sako Mūsų <span className="text-transparent bg-clip-text bg-luxury-gradient">Klientai</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -3px rgba(212, 175, 55, 0.2)" }}
                className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-md border border-elida-gold/10 transition-all duration-300"
              >
                <div className="flex mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-elida-gold fill-elida-gold" />
                  ))}
                </div>
                <p className="text-gray-600 mb-8 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* CTA Section */}
      <section className="py-24 bg-elida-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-elida-gold/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-16 flex items-center">
                <div>
                  <h2 className="font-playfair text-4xl text-gray-900 mb-8 leading-tight">
                    Pasiruošę <span className="text-transparent bg-clip-text bg-luxury-gradient">Tobulam Įdegiui</span>?
                  </h2>
                  <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                    Rezervuokite savo laiką dabar ir atraskite profesionalų aptarnavimą bei aukščiausios kokybės įrangą.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212, 175, 55, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/booking"
                      className="inline-block px-10 py-4 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium shadow-gold hover:shadow-gold-lg transition-all duration-300 text-lg"
                    >
                      Rezervuoti Vizitą
                    </Link>
                  </motion.div>
                </div>
              </div>
              <div className="relative h-64 md:h-auto overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  src="https://jp.lt/wp-content/uploads/2023/11/4T5A7204-1.jpg"
                  alt="ÉLIDA Soliariumo Interjeras"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}