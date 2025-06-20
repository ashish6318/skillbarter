// Email notification monitoring script
// This script helps monitor and debug email notifications in the SkillBarter app

const fs = require('fs');
const { spawn } = require('child_process');

class EmailNotificationMonitor {
  constructor() {
    this.emailKeywords = [
      'email sent',
      'EmailService',
      'email failed',
      'Session request email',
      'Session confirmation email', 
      'Session completion email',
      'Session cancellation email',
      'Email reminder sent',
      'Failed to send email',
      'nodemailer',
      'SMTP'
    ];
  }

  // Monitor server logs for email-related activity
  monitorServerLogs() {
    console.log('📡 Monitoring server logs for email activity...');
    console.log('📧 Watching for email-related keywords:');
    this.emailKeywords.forEach(keyword => console.log(`   - "${keyword}"`));
    console.log('');
    console.log('🔴 Press Ctrl+C to stop monitoring\n');

    // Start the server and monitor its output
    const serverProcess = spawn('node', ['server.js'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      this.filterAndDisplayEmailLogs(output, 'INFO');
    });

    serverProcess.stderr.on('data', (data) => {
      const output = data.toString();
      this.filterAndDisplayEmailLogs(output, 'ERROR');
    });

    serverProcess.on('close', (code) => {
      console.log(`\n📊 Server monitoring ended with code ${code}`);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping server monitoring...');
      serverProcess.kill();
      process.exit(0);
    });
  }

  // Filter and display email-related logs
  filterAndDisplayEmailLogs(logText, level) {
    const lines = logText.split('\n');
    
    lines.forEach(line => {
      if (line.trim()) {
        const hasEmailKeyword = this.emailKeywords.some(keyword => 
          line.toLowerCase().includes(keyword.toLowerCase())
        );

        if (hasEmailKeyword) {
          const timestamp = new Date().toLocaleTimeString();
          const levelIcon = level === 'ERROR' ? '❌' : '📧';
          console.log(`${levelIcon} [${timestamp}] ${line.trim()}`);
        }
      }
    });
  }

  // Check email configuration
  checkEmailConfig() {
    console.log('🔍 Checking Email Configuration...\n');
    
    try {
      // Check if .env file exists
      if (!fs.existsSync('.env')) {
        console.log('❌ .env file not found!');
        return false;
      }

      // Read .env file
      const envContent = fs.readFileSync('.env', 'utf8');
      const envLines = envContent.split('\n');
      
      const emailConfig = {};
      envLines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && key.startsWith('SMTP_')) {
          emailConfig[key.trim()] = value ? value.trim() : 'NOT SET';
        }
      });

      console.log('📧 Current SMTP Configuration:');
      Object.entries(emailConfig).forEach(([key, value]) => {
        const displayValue = key === 'SMTP_PASS' && value !== 'NOT SET' ? '***HIDDEN***' : value;
        const status = value === 'NOT SET' || value === 'your-email@gmail.com' || value === 'your-app-password' ? '❌' : '✅';
        console.log(`   ${status} ${key}: ${displayValue}`);
      });

      console.log('');
      
      // Check if properly configured
      const isConfigured = emailConfig.SMTP_USER && 
                          emailConfig.SMTP_USER !== 'NOT SET' && 
                          emailConfig.SMTP_USER !== 'your-email@gmail.com' &&
                          emailConfig.SMTP_PASS && 
                          emailConfig.SMTP_PASS !== 'NOT SET' &&
                          emailConfig.SMTP_PASS !== 'your-app-password';

      if (isConfigured) {
        console.log('✅ Email configuration appears to be set up correctly!');
        return true;
      } else {
        console.log('❌ Email configuration needs to be updated with real credentials.');
        console.log('📝 Update the following in your .env file:');
        console.log('   SMTP_USER=your-actual-email@gmail.com');
        console.log('   SMTP_PASS=your-app-password');
        return false;
      }

    } catch (error) {
      console.log('❌ Error checking email configuration:', error.message);
      return false;
    }
  }

  // Show help
  showHelp() {
    console.log('📧 SkillBarter Email Notification Monitor');
    console.log('');
    console.log('Commands:');
    console.log('  node monitor-email.js config     - Check email configuration');
    console.log('  node monitor-email.js monitor    - Monitor server logs for email activity');
    console.log('  node monitor-email.js test       - Run email tests');
    console.log('  node monitor-email.js help       - Show this help');
    console.log('');
    console.log('Examples:');
    console.log('  node monitor-email.js config     # Check if email is configured');
    console.log('  node monitor-email.js monitor    # Watch server logs for email activity');
    console.log('');
  }

  // Run email tests
  async runEmailTests() {
    console.log('🧪 Running Email Tests...\n');
    
    try {
      // Run the email test script
      const testProcess = spawn('node', ['test-email.js'], {
        cwd: process.cwd(),
        stdio: 'inherit'
      });

      testProcess.on('close', (code) => {
        console.log(`\n📊 Email test completed with code ${code}`);
        
        if (code === 0) {
          console.log('✅ Email tests passed!');
        } else {
          console.log('❌ Email tests failed. Check configuration.');
        }
      });

    } catch (error) {
      console.log('❌ Error running email tests:', error.message);
    }
  }
}

// Main execution
const monitor = new EmailNotificationMonitor();
const command = process.argv[2] || 'help';

switch (command.toLowerCase()) {
  case 'config':
    monitor.checkEmailConfig();
    break;
  case 'monitor':
    monitor.monitorServerLogs();
    break;
  case 'test':
    monitor.runEmailTests();
    break;
  case 'help':
  default:
    monitor.showHelp();
    break;
}
