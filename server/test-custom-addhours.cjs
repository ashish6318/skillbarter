// Test our custom addHours function
const addHours = (date, hours) => {
  const result = new Date(date);
  result.setTime(result.getTime() + (hours * 60 * 60 * 1000));
  return result;
};

console.log('Testing custom addHours function...');

// Test case 1: 30-minute duration
const currentSlot = new Date('2025-06-19T14:00:00.000Z'); // 2:00 PM UTC
const duration = 30; // minutes
const slotEnd = addHours(currentSlot, duration / 60);

console.log('Start time:', currentSlot.toISOString());
console.log('Duration:', duration, 'minutes =', duration / 60, 'hours');
console.log('End time:', slotEnd.toISOString());

// Convert to local time for display
console.log('Start (local):', currentSlot.toLocaleString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit', 
  hour12: true 
}));
console.log('End (local):', slotEnd.toLocaleString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit', 
  hour12: true 
}));

// Check if they're the same
if (currentSlot.getTime() === slotEnd.getTime()) {
  console.log('❌ ERROR: Start and end times are the same!');
} else {
  console.log('✅ Times are different');
  console.log('Difference:', (slotEnd.getTime() - currentSlot.getTime()) / (1000 * 60), 'minutes');
}

// Test multiple slots
console.log('\n--- Testing multiple 30-minute slots ---');
let slot = new Date('2025-06-19T14:00:00.000Z');
for (let i = 0; i < 5; i++) {
  const slotEnd = addHours(slot, 0.5);
  const startLocal = slot.toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  const endLocal = slotEnd.toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  console.log(`Slot ${i + 1}: ${startLocal} - ${endLocal}`);
  slot = new Date(slot.getTime() + 30 * 60 * 1000); // Next 30-minute slot
}
