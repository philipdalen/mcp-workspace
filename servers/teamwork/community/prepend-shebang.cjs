// prepend-shebang.js
const fs = require('fs');
const path = './build/index.js';
const shebang = '#!/usr/bin/env node\n';
const content = fs.readFileSync(path, 'utf8');
if (!content.startsWith(shebang)) {
  fs.writeFileSync(path, shebang + content);
}