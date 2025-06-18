// Simple test to verify slot generation logic
const testSlotGeneration = () => {
  // Mock date-fns functions
  const addHours = (date, hours) => {
    const result = new Date(date);
    result.setTime(result.getTime() + (hours * 60 * 60 * 1000));
    return result;
  };

  const parseISO = (dateString) => {
    return new Date(dateString + 'T00:00:00.000Z');
  };

  // Test with tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  console.log('Testing slot generation for:', tomorrowStr);

  const selectedDate = parseISO(tomorrowStr);
  const startOfDay = new Date(selectedDate);
  startOfDay.setUTCHours(9, 0, 0, 0); // 9 AM UTC
  const endOfDay = new Date(selectedDate);
  endOfDay.setUTCHours(21, 0, 0, 0); // 9 PM UTC

  console.log('Date range:', { selectedDate, startOfDay, endOfDay });

  // Generate available slots (every 30 minutes from 9 AM to 9 PM)
  const slots = [];
  let currentSlot = new Date(startOfDay);
  const now = new Date();

  console.log('Current time:', now);

  while (currentSlot < endOfDay) {
    const slotEnd = addHours(currentSlot, 1); // 1 hour duration
    
    // Only include future slots (at least 1 hour from now to allow booking time)
    const isInFuture = currentSlot.getTime() > (now.getTime() + 60 * 60 * 1000);

    console.log(`Slot: ${currentSlot.toISOString()} - Future: ${isInFuture}`);

    if (isInFuture) {
      slots.push({
        start: currentSlot.toISOString(),
        end: slotEnd.toISOString(),
        available: true
      });
    }

    currentSlot = addHours(currentSlot, 0.5); // 30-minute intervals
  }

  console.log('Generated slots:', slots.length);
  console.log('First few slots:', slots.slice(0, 3));
  
  return slots;
};

testSlotGeneration();
