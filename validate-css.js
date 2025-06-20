const fs = require('fs');
const path = require('path');

console.log('🔍 Validating CSS syntax...\n');

try {
  const cssFile = path.join(__dirname, 'src', 'index.css');
  const content = fs.readFileSync(cssFile, 'utf8');
  
  // Basic CSS validation
  let openBraces = 0;
  let closeBraces = 0;
  let lineNumber = 0;
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    lineNumber++;
    
    // Count braces
    openBraces += (line.match(/{/g) || []).length;
    closeBraces += (line.match(/}/g) || []).length;
    
    // Check for orphaned properties (properties without selectors)
    if (line.trim().match(/^[a-z-]+\s*:\s*[^;]+;?\s*$/) && 
        lineNumber > 1 && 
        !lines[lineNumber - 2].trim().includes('{')) {
      console.log(`⚠️  Potential orphaned property at line ${lineNumber}: ${line.trim()}`);
    }
  }
  
  console.log(`📊 CSS Analysis:`);
  console.log(`   Lines: ${lines.length}`);
  console.log(`   Open braces: ${openBraces}`);
  console.log(`   Close braces: ${closeBraces}`);
  
  if (openBraces === closeBraces) {
    console.log('✅ Brace count matches - CSS structure looks good!');
  } else {
    console.log('❌ Brace mismatch detected!');
    console.log(`   Missing ${openBraces > closeBraces ? 'closing' : 'opening'} braces: ${Math.abs(openBraces - closeBraces)}`);
  }
  
} catch (error) {
  console.error('❌ Error reading CSS file:', error.message);
}

console.log('\n🏁 CSS validation complete!');
