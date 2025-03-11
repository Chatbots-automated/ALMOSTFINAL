import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Booking, TimeSlot, BookedTimeSlot } from '../types/booking';
import { format, addDays } from 'date-fns';

const WEBHOOK_URLS = {
  'standing-1': 'https://hook.eu2.make.com/33lxkyn65qmjhcoq1fufr3ydq13uunqw',
  'lying-1': 'https://hook.eu2.make.com/qj2cbsdad1hkswdrt3ckkct3p7bmjsfw',
  'lying-2': 'https://hook.eu2.make.com/dqapvqe5ipg9gupvi44pdoac4llfxv1v'
};

const BUSINESS_HOURS = {
  1: { start: 9, end: 20 }, // Monday
  2: { start: 9, end: 20 }, // Tuesday
  3: { start: 9, end: 20 }, // Wednesday
  4: { start: 9, end: 20 }, // Thursday
  5: { start: 9, end: 20 }, // Friday
  6: { start: 9, end: 16 }, // Saturday
  0: { start: 9, end: 14 }  // Sunday
};

// Helper function to check if a time slot falls within a booked time range
const isTimeSlotBooked = (timeSlot: string, bookedRanges: BookedTimeSlot[]): boolean => {
  // Convert timeSlot (e.g., "09:15") to minutes since midnight for easier comparison
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const timeSlotMinutes = hours * 60 + minutes;
  
  // Check if the time slot falls within any of the booked ranges
  return bookedRanges.some(range => {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
    
    // Return true if the time slot is within the range (inclusive of start, exclusive of end)
    return timeSlotMinutes >= startMinutes && timeSlotMinutes < endMinutes;
  });
};

// Helper function to check if a time slot is before the minimum buffer time
const isBeforeMinimumBuffer = (timeSlot: string, date: string): boolean => {
  // Get current time in Europe/Vilnius timezone
  const now = new Date();
  const selectedDate = new Date(date);
  
  // If the selected date is in the future, all time slots are valid
  if (selectedDate.getDate() > now.getDate() || 
      selectedDate.getMonth() > now.getMonth() || 
      selectedDate.getFullYear() > now.getFullYear()) {
    return false;
  }
  
  // Convert timeSlot (e.g., "09:15") to a Date object for the selected date
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotTime = new Date(selectedDate);
  slotTime.setHours(hours, minutes, 0, 0);
  
  // Calculate the minimum buffer time (current time + 30 minutes)
  const bufferTime = new Date(now);
  bufferTime.setMinutes(bufferTime.getMinutes() + 30);
  
  // Round up to the next 15-minute interval
  const remainder = bufferTime.getMinutes() % 15;
  if (remainder > 0) {
    bufferTime.setMinutes(bufferTime.getMinutes() + (15 - remainder));
  }
  
  // Return true if the slot time is before the buffer time
  return slotTime < bufferTime;
};

// Function to get the earliest available time after buffer
export const getEarliestAvailableTime = (): string => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const businessHours = BUSINESS_HOURS[dayOfWeek as keyof typeof BUSINESS_HOURS];
  
  // Get current time in minutes since midnight
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const totalCurrentMinutes = currentHours * 60 + currentMinutes;
  
  // Get business hours in minutes
  const businessStartMinutes = businessHours.start * 60;
  const businessEndMinutes = businessHours.end * 60;

  // If current time is past business hours or near closing, return next day's opening time
  if (totalCurrentMinutes >= businessEndMinutes - 30 || // If within 30 minutes of closing or after closing
      totalCurrentMinutes < businessStartMinutes) {     // If before opening time
    const tomorrow = addDays(now, 1);
    const tomorrowDay = tomorrow.getDay();
    const tomorrowHours = BUSINESS_HOURS[tomorrowDay as keyof typeof BUSINESS_HOURS];
    return `${tomorrowHours.start.toString().padStart(2, '0')}:00`;
  }

  // Add 30 minutes buffer
  const bufferTime = new Date(now);
  bufferTime.setMinutes(bufferTime.getMinutes() + 30);
  
  // Round up to the next 15-minute interval
  const remainder = bufferTime.getMinutes() % 15;
  if (remainder > 0) {
    bufferTime.setMinutes(bufferTime.getMinutes() + (15 - remainder));
  }

  // If the buffer time pushes us past business hours, return next day's opening time
  const bufferHours = bufferTime.getHours();
  const bufferMinutes = bufferTime.getMinutes();
  const totalBufferMinutes = bufferHours * 60 + bufferMinutes;

  if (totalBufferMinutes >= businessEndMinutes - 30) {
    const tomorrow = addDays(now, 1);
    const tomorrowDay = tomorrow.getDay();
    const tomorrowHours = BUSINESS_HOURS[tomorrowDay as keyof typeof BUSINESS_HOURS];
    return `${tomorrowHours.start.toString().padStart(2, '0')}:00`;
  }

  // Return the buffer time if it's within business hours
  return bufferTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export const fetchAvailableTimeSlots = async (cabinId: string, date: string): Promise<TimeSlot[]> => {
  try {
    const webhookUrl = WEBHOOK_URLS[cabinId as keyof typeof WEBHOOK_URLS];
    if (!webhookUrl) {
      throw new Error('Invalid cabin ID');
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch time slots');
    }

    const data = await response.json();
    
    // Extract booked time ranges for the specific date
    const selectedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
    const bookedRanges: BookedTimeSlot[] = [];
    
    // Process all events from Google Calendar
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((event: { start: { dateTime: string }, end: { dateTime: string } }) => {
        const startDateTime = new Date(event.start.dateTime);
        const endDateTime = new Date(event.end.dateTime);
        const eventDate = startDateTime.toISOString().split('T')[0];
        
        // Only include events for the selected date
        if (eventDate === selectedDate) {
          bookedRanges.push({
            start: event.start.dateTime,
            end: event.end.dateTime
          });
        }
      });
    }

    // Get day of week (0-6, where 0 is Sunday)
    const dayOfWeek = new Date(date).getDay();
    const { start, end } = BUSINESS_HOURS[dayOfWeek as keyof typeof BUSINESS_HOURS];

    // Generate all possible time slots for the day based on business hours
    const timeSlots: TimeSlot[] = [];
    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this time slot is booked for the specific date
        const isBooked = isTimeSlotBooked(time, bookedRanges);
        
        // Check if this time slot is before the minimum buffer time
        const isTooSoon = isBeforeMinimumBuffer(time, date);

        // Check if the time slot is within business hours
        const slotDate = new Date(date);
        const [slotHours, slotMinutes] = time.split(':').map(Number);
        slotDate.setHours(slotHours, slotMinutes);
        
        const isWithinBusinessHours = 
          slotHours >= start && 
          (slotHours < end || (slotHours === end && slotMinutes === 0));

        timeSlots.push({
          time,
          available: !isBooked && !isTooSoon && isWithinBusinessHours
        });
      }
    }

    return timeSlots;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
};

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const now = new Date().toISOString();

    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: now,
      updatedAt: now,
      status: 'confirmed',
    });

    const webhookUrl = WEBHOOK_URLS[bookingData.cabin as keyof typeof WEBHOOK_URLS];
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'new_booking',
          booking: {
            ...bookingData,
            id: bookingRef.id,
          },
        }),
      });
    }

    return bookingRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(bookingsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string, cabinId: string) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });

    const webhookUrl = WEBHOOK_URLS[cabinId as keyof typeof WEBHOOK_URLS];
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'cancel_booking',
          bookingId,
        }),
      });
    }
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};