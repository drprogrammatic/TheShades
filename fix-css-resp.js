const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

const brokenRegex = /\/\* Responsive \*\/[\s\S]+?\.category-grid \{ grid-template-columns: 1fr; \}/m;
const cleanResponsive = `/* Responsive */

@media (max-width: 1024px) {
  .category-grid { grid-template-columns: repeat(2, 1fr); }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
  .blog-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
  .product-detail-grid { grid-template-columns: 1fr; }
  .admin-stats { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  :root {
    --space-4xl: 4rem;
    --space-3xl: 3rem;
  }

  .nav { display: none; }
  .menu-toggle { display: flex; }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-white);
    padding: var(--space-xl);
    transform: translateX(100%);
    transition: transform var(--transition-base);
    z-index: 999;
  }

  .mobile-nav.open {
    transform: translateX(0);
  }

  .hero-title { font-size: 2.5rem; }
  .hero-desc { font-size: 1rem; }
  
  .category-grid { grid-template-columns: 1fr; }`;

content = content.replace(brokenRegex, cleanResponsive);
fs.writeFileSync('src/app/globals.css', content, 'utf8');
console.log('Fixed broken responsive block.');
