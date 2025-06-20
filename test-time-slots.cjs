// Test script to check time slot API
const https = require('https');
const http = require('http');

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

async function testTimeSlots() {
    try {
        // First get a teacher ID
        console.log('Getting teacher list...');
        const discoverResponse = await makeRequest('http://localhost:5000/api/discover');
        
        if (!discoverResponse.success || !discoverResponse.data || discoverResponse.data.length === 0) {
            console.error('No teachers found');
            return;
        }
        
        const teacher = discoverResponse.data[0];
        console.log('Using teacher:', teacher.firstName, teacher.lastName, 'ID:', teacher._id);
        
        // Test time slots with 30-minute duration
        const testDate = '2025-06-19';
        const duration = 30;
        
        console.log('\nTesting time slots API...');
        console.log('Date:', testDate);
        console.log('Duration:', duration);
        
        const slotsUrl = `http://localhost:5000/api/sessions/available-slots/${teacher._id}?date=${testDate}&duration=${duration}`;
        console.log('URL:', slotsUrl);
          const response = await makeRequest(slotsUrl);
        
        console.log('\nAPI Response:');
        console.log('Full response:', JSON.stringify(response, null, 2));
        
        if (response.slots && response.slots.length > 0) {
            console.log('\nFirst 5 slots:');
            response.slots.slice(0, 5).forEach((slot, index) => {
                const start = new Date(slot.start);
                const end = new Date(slot.end);
                
                console.log(`Slot ${index + 1}:`);
                console.log('  Raw start:', slot.start);
                console.log('  Raw end:', slot.end);
                console.log('  Start time:', start.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                }));
                console.log('  End time:', end.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                }));
                console.log('  Formatted: ', start.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                }) + ' - ' + end.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                }));
                console.log('  Duration check:', (end.getTime() - start.getTime()) / (1000 * 60), 'minutes');
                
                // Check if start and end are the same (the reported issue)
                if (start.getTime() === end.getTime()) {
                    console.log('  ❌ ERROR: Start and end times are the same!');
                } else {
                    console.log('  ✅ Start and end times are different');
                }
                console.log('---');
            });
        } else {
            console.log('No slots available');
        }
        
    } catch (error) {
        console.error('Error testing time slots:', error.message);
    }
}

testTimeSlots();
