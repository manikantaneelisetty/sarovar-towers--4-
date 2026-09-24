const fs = require('fs');
let code = fs.readFileSync('src/pages/FlatDetails.jsx', 'utf8');

// 1. Color replace
code = code.replace(/#ecc31f/g, '#38BDF8');

// 2. Arrow changes
code = code.replace(/width:\s*'56px'/g, "width: '40px'");
code = code.replace(/height:\s*'56px'/g, "height: '40px'");
code = code.replace(/<HiArrowSmLeft size=\{28\}\s*\/>/g, "<HiArrowSmLeft size={20} />");
code = code.replace(/<HiArrowSmRight size=\{28\}\s*\/>/g, "<HiArrowSmRight size={20} />");

code = code.replace(/position:\s*'absolute',\s*top:\s*'50%',\s*left:\s*'-25px',/g, "position: 'fixed', top: '50%', left: 'max(2%, calc(50vw - 750px))',");
code = code.replace(/position:\s*'absolute',\s*top:\s*'50%',\s*right:\s*'-25px',/g, "position: 'fixed', top: '50%', right: 'max(2%, calc(50vw - 750px))',");

// 3. Flat image replace
code = code.replace(/let flatImage = \/images\/t\$\{tower\}-flats\/1\$\{flatSuffix\}\.png;/g, 'let flatImage = /images/f/t-flats/1.png;');

// 4. Remove '101' if block
code = code.replace(/if\s*\(flat\s*===\s*'101'\)\s*\{\s*flatImage\s*=\s*'\/images\/f\/isometric_Final_02\.png';\s*\}/g, '');

// 5. addToCompare replace
code = code.replace(/image:\s*flatImage,/g, 'image: /images/t-flats/1.png,');

fs.writeFileSync('src/pages/FlatDetails.jsx', code);
