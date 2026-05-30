const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

const brokenRegex = /\/\* Loading skeleton \*\/[\s\S]+?\}[\s\S]+?0% \{ background-position: 200% 0; \}[\s\S]+?100% \{ background-position: -200% 0; \}[\s\S]+?\}/m;
const cleanSkeleton = `/* Loading skeleton */
.skeleton {
  background: linear-gradient(90deg, var(--color-bg-alt) 25%, var(--color-border-light) 50%, var(--color-bg-alt) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`;

content = content.replace(brokenRegex, cleanSkeleton);
fs.writeFileSync('src/app/globals.css', content, 'utf8');
console.log('Fixed broken skeleton block.');
