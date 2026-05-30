const fs = require('fs');

try {
  // Read the raw buffer
  const buffer = fs.readFileSync('src/app/globals.css');
  
  // Try treating the entire file as UTF-16 LE
  let text = buffer.toString('utf16le');
  
  // Clean null bytes if they exist in a standard utf8 read
  let utf8Text = buffer.toString('utf8');
  let cleaned = utf8Text.replace(/\0/g, '');
  
  if (cleaned.includes('. b r a n d -') || cleaned.includes('\n \n')) {
     // manual cleanup
     cleaned = cleaned.replace(/ (.) /g, '$1'); 
  }

  // Remove the appended brand marquee code we previously added to start fresh
  const brandIndex = cleaned.indexOf('/* Brand Marquee Section */');
  if (brandIndex > -1) {
    cleaned = cleaned.substring(0, brandIndex);
  }
  
  // Ensure we don't end in the middle of a CSS rule
  const lastBracket = cleaned.lastIndexOf('}');
  if (lastBracket > -1) {
    cleaned = cleaned.substring(0, lastBracket + 1);
  }
  
  cleaned = cleaned.trim() + '\n\n';
  
  const newCss = `/* Brand Marquee Section */
.brand-section {
  padding: var(--space-3xl) 0 0;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border-light);
  overflow: hidden;
}

.brand-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.brand-header h2 {
  font-size: 1.5rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: var(--space-sm);
}

.brand-header p {
  color: var(--color-text-light);
  font-size: 0.95rem;
  max-width: 600px;
  margin: 0 auto;
}

.brand-marquee-container {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow: hidden;
  padding: var(--space-lg) 0 var(--space-2xl);
  position: relative;
  display: flex;
}

.brand-marquee-container::before,
.brand-marquee-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15vw;
  z-index: 2;
  pointer-events: none;
}

.brand-marquee-container::before {
  left: 0;
  background: linear-gradient(to right, var(--color-bg), transparent);
}

.brand-marquee-container::after {
  right: 0;
  background: linear-gradient(to left, var(--color-bg), transparent);
}

.brand-marquee {
  display: flex;
  align-items: center;
  gap: 4rem;
  white-space: nowrap;
  animation: scrollMarquee 40s linear infinite;
  padding: 0 2rem;
}

.brand-marquee:hover {
  animation-play-state: paused;
}

.brand-logo {
  height: 40px;
  min-width: 120px;
  color: var(--color-text-muted);
  transition: all var(--transition-base);
  opacity: 0.6;
  filter: grayscale(100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo svg {
  width: 100%;
  height: 100%;
}

.brand-logo:hover {
  opacity: 1;
  color: var(--color-heading);
  transform: scale(1.05);
}

@keyframes scrollMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 2rem)); }
}

@media (max-width: 768px) {
  .brand-marquee { gap: 2.5rem; animation-duration: 30s; }
  .brand-logo { height: 32px; min-width: 90px; }
}
`;

  fs.writeFileSync('src/app/globals.css', cleaned + newCss, 'utf8');
  console.log('Fixed globally!');
  
} catch (e) {
  console.error(e);
}
