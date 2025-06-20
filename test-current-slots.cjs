// Test current time slot generation with new logic
const currentTime = new Date();
console.log('Current time:', currentTime.toLocaleString());
console.log('Current hour:', currentTime.getHours());

// Simulate the NEW backend logic
const testDate = '2025-06-19';
const selectedDate = new Date(testDate + 'T12:00:00.000Z');
const isToday = selectedDate.toDateString() === currentTime.toDateString();

let startHour, endHour;

if (isToday) {
  // For today: start from current hour (or a bit earlier for immediate testing)
  startHour = Math.max(0, currentTime.getHours() - 1);
  endHour = 23;
} else {
  // For future dates: normal business hours
  startHour = 6;  // 6 AM
  endHour = 23;   // 11 PM
}

console.log('Is today:', isToday);
console.log('Available slot hours:', startHour, 'to', endHour);

// Show what slots would be available using LOCAL time
const startOfDay = new Date(selectedDate);
const endOfDay = new Date(selectedDate);

startOfDay.setHours(startHour, 0, 0, 0);
endOfDay.setHours(endHour, 0, 0, 0);

console.log('\nGenerated time range (LOCAL):');
console.log('Start:', startOfDay.toLocaleString());
console.log('End:', endOfDay.toLocaleString());

// Show first few slots
console.log('\nFirst 10 available 30-minute slots:');
let currentSlot = new Date(startOfDay);
const now = new Date();

for (let i = 0; i < 10 && currentSlot < endOfDay; i++) {
  const slotEnd = new Date(currentSlot.getTime() + 30 * 60 * 1000);
  const isInFuture = currentSlot.getTime() > (now.getTime() + 1 * 60 * 1000); // 1 minute buffer
  
  console.log(`${i + 1}. ${currentSlot.toLocaleTimeString()} - ${slotEnd.toLocaleTimeString()} ${isInFuture ? '✅' : '❌ (past)'}`);
  
  currentSlot = new Date(currentSlot.getTime() + 30 * 60 * 1000);
}
