const { addHours } = require('date-fns');

console.log('Testing addHours function...');
console.log('addHours function:', typeof addHours);

// Test case 1: 30-minute duration
const currentSlot = new Date('2025-06-19T14:00:00.000Z'); // 2:00 PM UTC
console.log('Original date object:', currentSlot);

const duration = 30; // minutes
console.log('Adding', duration / 60, 'hours to the date...');

const slotEnd = addHours(currentSlot, duration / 60);
console.log('Result from addHours:', slotEnd);

console.log('Start time:', currentSlot.toISOString());
console.log('Duration:', duration, 'minutes =', duration / 60, 'hours');
console.log('End time:', slotEnd.toISOString());

// Test with manual date addition
const manualEnd = new Date(currentSlot.getTime() + (duration * 60 * 1000));
console.log('Manual calculation:', manualEnd.toISOString());

// Check if they're the same
if (currentSlot.getTime() === slotEnd.getTime()) {
  console.log('❌ ERROR: addHours is not working - Start and end times are the same!');
} else {
  console.log('✅ addHours is working - Times are different');
  console.log('Difference:', (slotEnd.getTime() - currentSlot.getTime()) / (1000 * 60), 'minutes');
}
