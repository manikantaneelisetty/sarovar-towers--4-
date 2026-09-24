const fs = require('fs');
let code = fs.readFileSync('src/pages/FloorView.jsx', 'utf8');

// Icons
code = code.replace(/import \{ (.*?)ChevronLeft(.*?) \} from 'lucide-react';/, "import { $1$2 } from 'lucide-react';\nimport { HiArrowSmLeft, HiArrowSmRight } from 'react-icons/hi';");
code = code.replace(/<ChevronLeft size=\{28\} \/>/g, '<HiArrowSmLeft size={28} />');
code = code.replace(/<ChevronRight size=\{28\} \/>/g, '<HiArrowSmRight size={28} />');

// Remove border #ecc31f
code = code.replace(/border: '1px solid #ecc31f'/g, "border: 'none'");

// Arrow button background & color & size
code = code.replace(/background: 'rgba\\(255, 255, 255, 0\\.8\\)'/g, "background: 'rgba(0, 0, 0, 0.6)'");
code = code.replace(/width: '48px'/g, "width: '56px'");
code = code.replace(/height: '48px'/g, "height: '56px'");
code = code.replace(/color: floor <= 1 \? '#ccc' : '#ecc31f'/g, "color: floor <= 1 ? 'rgba(255,255,255,0.3)' : 'white'");
code = code.replace(/color: floor >= 50 \? '#ccc' : '#ecc31f'/g, "color: floor >= 50 ? 'rgba(255,255,255,0.3)' : 'white'");

// Remove onMouseOver and onMouseOut for arrows
code = code.replace(/\s*onMouseOver=\{e => \{ if \(floor > 1\) .*? \}\}\s*/g, "\n");
code = code.replace(/\s*onMouseOut=\{e => \{ if \(floor > 1\) .*? \}\}\s*/g, "\n");
code = code.replace(/\s*onMouseOver=\{e => \{ if \(floor < 50\) .*? \}\}\s*/g, "\n");
code = code.replace(/\s*onMouseOut=\{e => \{ if \(floor < 50\) .*? \}\}\s*/g, "\n");

// Carpet Area and Orientation text color
code = code.replace(/color: 'var\(--text-secondary\)' \}\}>Carpet Area/g, "color: 'white' }}>Carpet Area");
code = code.replace(/color: 'var\(--text-secondary\)' \}\}>Orientation/g, "color: 'white' }}>Orientation");

// Hover card background/border
code = code.replace(/background: 'rgba\\(3, 3, 3, 0\\.9\\)',\s*backdropFilter: 'blur\\(10px\\)',\s*border: 'none',/g, "background: 'rgba(3, 3, 3, 0.9)', backdropFilter: 'blur(10px)', border: 'none',");

fs.writeFileSync('src/pages/FloorView.jsx', code);
