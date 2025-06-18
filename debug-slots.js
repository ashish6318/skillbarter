// Debug script to test slot generation
const { addHours, isAfter, parseISO } = require('date-fns');

const debugSlotGeneration = (date, duration = 60) => {
  console.log('Input date:', date);
  
  const selectedDate = parseISO(date);
  console.log('Parsed selectedDate:', selectedDate);
  
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(9, 0, 0, 0); // 9 AM
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(21, 0, 0, 0); // 9 PM

  console.log('Start of day:', startOfDay);
  console.log('End of day:', endOfDay);
  console.log('Current time:', new Date());

  // Generate available slots (every 30 minutes from 9 AM to 9 PM)
  const slots = [];
  let currentSlot = new Date(startOfDay);

  while (currentSlot < endOfDay) {
    const slotEnd = addHours(currentSlot, duration / 60);
    
    const isFuture = isAfter(currentSlot, new Date());
    console.log(`Slot ${currentSlot.toISOString()} - Future: ${isFuture}`);
    
    if (isFuture) {
      slots.push({
        start: currentSlot.toISOString(),
        end: slotEnd.toISOString(),
        available: true
      });
    }

    currentSlot = addHours(currentSlot, 0.5); // 30-minute intervals
  }

  console.log('Generated slots:', slots.length);
  return slots;
};

// Test with today's date
const today = new Date().toISOString().split('T')[0];
console.log('Testing with today:', today);
debugSlotGeneration(today);

console.log('\n---\n');

// Test with tomorrow's date
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];
console.log('Testing with tomorrow:', tomorrowStr);
debugSlotGeneration(tomorrowStr);
