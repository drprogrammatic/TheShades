const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

const brokenRegex = /\/\* Animations \*\/[\s\S]+?\.animate-fade-in-up \{/m;
const cleanAnimations = `/* Animations */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {`;

content = content.replace(brokenRegex, cleanAnimations);
fs.writeFileSync('src/app/globals.css', content, 'utf8');
console.log('Fixed broken animations block.');
