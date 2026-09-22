const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      let modified = false;
      let inButton = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('<button') || line.includes('<Link') || line.includes('<input')) {
          inButton = true;
        }
        
        if (line.includes('borderRadius:') || line.includes('borderRadius :')) {
          if (!inButton && !line.includes('50%')) {
             lines[i] = line.replace(/borderRadius:\s*['"](?:12px|16px|20px|24px|8px)['"]/, "borderRadius: '5px'");
             lines[i] = lines[i].replace(/borderRadius:\s*isMobile \? '0' : '16px'/, "borderRadius: isMobile ? '0' : '5px'");
             if (lines[i] !== line) modified = true;
          }
        }
        
        if (line.includes('</button>') || line.includes('</Link>') || (line.includes('/>') && inButton)) {
          inButton = false;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
        console.log('Modified: ' + fullPath);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src'));
