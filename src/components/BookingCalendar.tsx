import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore, startOfToday, parseISO } from 'date-fns';
import { lt } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Loader2, 
  User, 
  Mail, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles, 
  Shield, 
  Zap,
  ChevronRight,
  ChevronLeft,
  Info,
  AlertCircle
} from 'lucide-react';
import { cabins } from '../config/cabins';
import { TimeSlot, BookingFormData } from '../types/booking';
import { useAuth } from '../context/AuthContext';
import { createBooking, fetchAvailableTimeSlots, getEarliestAvailableTime } from '../services/bookingService';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -100,
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export default function BookingCalendar() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCabin, setSelectedCabin] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [earliestTime, setEarliestTime] = useState('');
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSummary, setBookingSummary] = useState<{
    cabinName: string;
    date: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    // Get the earliest available time when component mounts
    setEarliestTime(getEarliestAvailableTime());
  }, []);

  const loadTimeSlots = async (cabinId: string, date: Date) => {
    try {
      setLoading(true);
      setError('');
      const slots = await fetchAvailableTimeSlots(cabinId, format(date, 'yyyy-MM-dd'));
      setTimeSlots(slots);
    } catch (err) {
      setError('Nepavyko užkrauti laisvų laikų');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCabin && currentStep === 2) {
      loadTimeSlots(selectedCabin, selectedDate);
    } else {
      setTimeSlots([]);
    }
  }, [selectedCabin, selectedDate, currentStep]);

  const handleCabinSelect = (cabinId: string) => {
    setSelectedCabin(cabinId);
  };

  const formatDateTimeForWebhook = (date: Date, timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const bookingDate = new Date(date);
    bookingDate.setHours(parseInt(hours, 10));
    bookingDate.setMinutes(parseInt(minutes, 10));
    bookingDate.setSeconds(0);
    
    return format(bookingDate, "yyyy-MM-dd'T'HH:mm:ss");
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCabin || !selectedTime || !fullName || !email) {
      setError('Prašome užpildyti visus laukus');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData: BookingFormData = {
        cabin: selectedCabin,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
      };

      const formattedDateTime = formatDateTimeForWebhook(selectedDate, selectedTime);

      const response = await fetch('https://hook.eu2.make.com/yw5ie28y0kmrkeafigpynd289dk6u1qh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          dateTime: formattedDateTime,
          timeZone: 'Europe/Vilnius',
          cabin: selectedCabin,
          cabinName: cabins.find(c => c.id === selectedCabin)?.name || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      setSuccess(true);
      setSelectedCabin('');
      setSelectedTime('');
      setTimeSlots([]);
      setFullName('');
      setEmail('');

      createBooking({
        ...bookingData,
        userId: user?.uid || 'anonymous',
        userEmail: email,
        status: 'confirmed',
      }).catch(console.error);
    } catch (err) {
      setError('Įvyko klaida! Prašome bandyti dar kartą.');
    } finally {
      setLoading(false);
    }
  };

  // Cabin features based on cabin type
  const getCabinFeatures = (cabinId: string) => {
    if (cabinId === 'lying-1') {
      return [
        "44 kūno lempos, 4 veido lempos",
        "Viso kūno vėdinimo sistema",
        "Kokybišką garso sistema"
      ];
    } else if (cabinId === 'lying-2') {
      return [
        "44 kūno lempos, 4 veido lempos",
        "Viso kūno vėdinimo sistema",
        "Aromaterapija",
        "Muzikos sistema",
        "Oro kondicionierius",
        "Balso gidas",
        "Kokybiška garso sistema",
        "Aqua vandens dulksna",
        "Aroma terapija"
      ];
    } else if (cabinId === 'standing-1') {
      return [
        "52 kūno lempos, 2 pečių zonos lempos",
        "Purškimo sistema",
        "Vėdinimo sistema",
        "LED apšvietimas",
        "Aqua vandens dulksna",
        "Viso kūno vėdinimo sistema",
        "Balso gidas",
        "Kokybiška garso sistema"
      ];
    }
    return [];
  };

  // Cabin icon mapping
  const getCabinIcon = (type: string) => {
    switch(type) {
      case 'lying':
        return <Sparkles className="h-5 w-5 text-elida-gold" />;
      case 'standing':
        return <Zap className="h-5 w-5 text-elida-gold" />;
      default:
        return <Shield className="h-5 w-5 text-elida-gold" />;
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1 && !selectedCabin) {
      setError('Prašome pasirinkti kabiną');
      return;
    }
    
    if (currentStep === 2 && !selectedTime) {
      setError('Prašome pasirinkti laiką');
      return;
    }
    
    if (currentStep === 2) {
      // Set booking summary for the final step
      const selectedCabinData = cabins.find(c => c.id === selectedCabin);
      setBookingSummary({
        cabinName: selectedCabinData?.name || '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime
      });
    }
    
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const goToPreviousStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div 
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${currentStep === step 
                  ? 'border-elida-gold bg-elida-gold text-white' 
                  : currentStep > step 
                    ? 'border-elida-gold bg-elida-gold/20 text-elida-gold' 
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
            >
              {currentStep > step ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
              
              {/* Step label */}
              <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className={`text-xs font-medium ${currentStep === step ? 'text-elida-gold' : 'text-gray-500'}`}>
                  {step === 1 ? 'Kabina' : step === 2 ? 'Data ir laikas' : 'Kontaktai'}
                </span>
              </div>
            </div>
            
            {step < 3 && (
              <div 
                className={`w-12 h-0.5 mx-1 
                  ${currentStep > step ? 'bg-elida-gold' : 'bg-gray-300'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-12 max-w-2xl mx-auto text-center relative overflow-hidden"
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-elida-gold to-elida-accent"></div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-75"></div>
            <CheckCircle className="h-12 w-12 text-green-500 relative z-10" />
          </div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-playfair text-3xl text-gray-900 mb-6"
        >
          Rezervacija sėkmingai patvirtinta!
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          Jūsų vizitas sėkmingai užregistruotas. Netrukus gausite patvirtinimo el. laišką su detalia informacija apie Jūsų rezervaciją. Dėkojame, kad pasirinkote ÉLIDA!
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500 mb-8 space-y-2 bg-gray-50 p-6 rounded-xl"
        >
          <p>Jei turite klausimų, susisiekite su mumis:</p>
          <p>Tel.: (8-644) 40596</p>
          <p>El. paštas: info@elida.lt</p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSuccess(false);
            setCurrentStep(1);
          }}
          className="px-8 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium 
                   hover:shadow-lg transform transition-all duration-300 group relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer pointer-events-none"></div>
          
          <span className="flex items-center gap-2 relative z-10">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Grįžti į rezervacijų kalendorių
          </span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        {/* Progress indicator */}
        {renderProgressIndicator()}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2"
          >
            <Info className="h-4 w-4 text-red-500" />
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Cabin Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-8"
            >
              <motion.h3 
                {...fadeIn}
                className="text-xl font-playfair text-gray-900 mb-6 flex items-center gap-3"
              >
                <div className="p-2 bg-elida-gold/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-elida-gold" />
                </div>
                Pasirinkite kabiną
              </motion.h3>
              
              <motion.div 
                {...fadeIn}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {cabins.map((cabin) => (
                  <motion.button
                    key={cabin.id}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCabinSelect(cabin.id)}
                    className={`relative p-6 rounded-xl text-left transition-all duration-300 overflow-hidden
                      ${selectedCabin === cabin.id
                        ? 'border-2 border-elida-gold bg-gradient-to-br from-elida-gold/5 to-elida-gold/10 shadow-lg'
                        : 'border border-gray-100 hover:border-elida-gold/50 hover:shadow-md bg-white/70 backdrop-blur-sm'
                      }`}
                  >
                    {/* Cabin image */}
                    <div className="w-full h-32 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={cabin.image} 
                        alt={cabin.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Shimmer effect on selected cabin */}
                    {selectedCabin === cabin.id && (
                      <div className="absolute inset-0 shimmer pointer-events-none"></div>
                    )}
                    
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${selectedCabin === cabin.id ? 'bg-elida-gold/20' : 'bg-gray-50'}`}>
                        {getCabinIcon(cabin.type)}
                      </div>
                      <div>
                        <h4 className="font-playfair text-lg text-gray-900">{cabin.name}</h4>
                        <p className="text-xs text-elida-gold font-medium mt-1">
                          {cabin.pricePerMinute.toFixed(2)}€/min
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cabin.description}</p>
                    
                    {/* Features list */}
                    {selectedCabin === cabin.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-1"
                      >
                        <p className="text-xs font-medium text-elida-gold mb-2">Savybės:</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {getCabinFeatures(cabin.id).map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-elida-gold rounded-full mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    
                    {/* Selection indicator */}
                    {selectedCabin === cabin.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-2 right-2 w-2 h-2 bg-elida-gold rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
              
              <motion.div 
                {...fadeIn}
                className="flex justify-end mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToNextStep}
                  disabled={!selectedCabin}
                  className="px-8 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium 
                           shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  {selectedCabin && (
                    <div className="absolute inset-0 shimmer pointer-events-none"></div>
                  )}
                  
                  <span className="relative z-10">Toliau</span>
                  <ChevronRight className="h-5 w-5 relative z-10" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Date and Time Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-8"
            >
              {/* Date Selection */}
              <motion.div {...fadeIn}>
                <h3 className="text-xl font-playfair text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-elida-gold" />
                  </div>
                  Pasirinkite datą
                </h3>
                <div className="grid grid-cols-7 gap-3">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = addDays(new Date(), i);
                    const isDisabled = isBefore(date, startOfToday());
                    const isToday = i === 0;
                    
                    return (
                      <motion.button
                        key={i}
                        whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                        onClick={() => setSelectedDate(date)}
                        disabled={isDisabled}
                        className={`p-4 rounded-xl text-center transition-all duration-300 relative ${
                          format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                            ? 'bg-gradient-to-br from-elida-gold to-elida-accent text-white shadow-lg'
                            : isDisabled
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-white hover:bg-elida-gold/5 hover:shadow-md border border-gray-100'
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {format(date, 'EEE', { locale: lt })}
                        </div>
                        <div className="text-lg font-playfair mt-1">
                          {format(date, 'd')}
                        </div>
                        
                        {/* Today indicator */}
                        {isToday && !isDisabled && format(selectedDate, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd') && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-elida-gold rounded-full"></div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Time Selection */}
              <motion.div {...fadeIn}>
                <h3 className="text-xl font-playfair text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <Clock className="h-5 w-5 text-elida-gold" />
                  </div>
                  Pasirinkite laiką
                </h3>
                
                {/* Minimum booking time buffer notice */}
                {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-100 rounded-xl text-amber-700 text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <span>
                      Šiandien galite rezervuoti vizitą tik nuo <strong>{earliestTime}</strong> valandos. 
                      Ankstesni laikai nėra pasiekiami.
                    </span>
                  </motion.div>
                )}
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-elida-gold animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    <AnimatePresence>
                      {timeSlots.map((slot) => (
                        <motion.button
                          key={slot.time}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={slot.available ? { scale: 1.08, y: -2 } : {}}
                          whileTap={slot.available ? { scale: 0.95 } : {}}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`relative p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            selectedTime === slot.time
                              ? 'bg-gradient-to-br from-elida-gold to-elida-accent text-white shadow-lg'
                              : !slot.available
                              ? 'bg-gray-50 text-gray-300 cursor-not-allowed overflow-hidden'
                              : 'bg-white hover:bg-elida-gold/5 hover:shadow-md border border-gray-100'
                          }`}
                        >
                          {/* Crosshatch pattern for unavailable slots */}
                          {!slot.available && (
                            <div className="absolute inset-0 opacity-10" 
                                 style={{
                                   backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
                                   backgroundSize: '8px 8px'
                                 }}
                            />
                          )}
                          
                          {slot.time}
                          
                          {/* Selection indicator */}
                          {selectedTime === slot.time && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"
                            />
                          )}
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                {...fadeIn}
                className="flex justify-between mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToPreviousStep}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-medium 
                           hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Atgal
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToNextStep}
                  disabled={!selectedTime}
                  className="px-8 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium 
                           shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  {selectedTime && (
                    <div className="absolute inset-0 shimmer pointer-events-none"></div>
                  )}
                  
                  <span className="relative z-10">Toliau</span>
                  <ChevronRight className="h-5 w-5 relative z-10" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-8"
            >
              {/* Booking Summary */}
              {bookingSummary && (
                <motion.div 
                  {...fadeIn}
                  className="bg-elida-gold/5 rounded-xl p-6 border border-elida-gold/20"
                >
                  <h3 className="font-playfair text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-elida-gold" />
                    Jūsų rezervacijos informacija
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                      <p className="text-gray-500 mb-1">Kabina</p>
                      <p className="font-medium text-gray-900">{bookingSummary.cabinName}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                      <p className="text-gray-500 mb-1">Data</p>
                      <p className="font-medium text-gray-900">{format(parseISO(bookingSummary.date), 'yyyy-MM-dd')}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                      <p className="text-gray-500 mb-1">Laikas</p>
                      <p className="font-medium text-gray-900">{bookingSummary.time}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Contact Information Form */}
              <motion.div 
                {...fadeIn}
                className="space-y-6"
              >
                <h3 className="text-xl font-playfair text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <User className="h-5 w-5 text-elida-gold" />
                  </div>
                  Kontaktinė Informacija
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Vardas Pavardė *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent
                               placeholder-gray-400 transition-all duration-300"
                      placeholder="Jonas Jonaitis"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      El. Paštas *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 
                               focus:ring-2 focus:ring-elida-gold focus:border-transparent
                               placeholder-gray-400 transition-all duration-300"
                      placeholder="jonas@pavyzdys.lt"
                      required
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                {...fadeIn}
                className="flex justify-between mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToPreviousStep}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-medium 
                           hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Atgal
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBooking}
                  disabled={loading || !fullName || !email}
                  className="px-8 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-full font-medium 
                           shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  {fullName && email && !loading && (
                    <div className="absolute inset-0 shimmer pointer-events-none"></div>
                  )}
                  
                  <span className="relative z-10">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Tvirtinama...
                      </div>
                    ) : (
                      'Patvirtinti rezervaciją'
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}