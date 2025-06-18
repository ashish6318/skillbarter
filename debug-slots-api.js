// Debug helper - Add this to your console to test slot generation manually
const testSlotAPI = async (teacherId) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  try {
    const response = await fetch(`http://localhost:5000/api/sessions/user/${teacherId}/slots?date=${tomorrowStr}&duration=60`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Slots API Response:', data);
    return data;
  } catch (error) {
    console.error('Error testing slots API:', error);
  }
};

// Usage: testSlotAPI('TEACHER_ID_HERE')
