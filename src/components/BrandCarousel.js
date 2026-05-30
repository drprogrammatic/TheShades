import React from 'react';

// Common industry partner brands
const brands = [
  { name: 'MAC', svg: <svg viewBox="0 0 120 40" fill="currentColor"><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="bold" letterSpacing="2">MAC</text></svg> },
  { name: 'D\'Decor', svg: <svg viewBox="0 0 120 40" fill="currentColor"><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="bold" fontStyle="italic">D'Decor</text></svg> },
  { name: 'Somfy', svg: <svg viewBox="0 0 120 40" fill="currentColor"><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="800">SOMFY</text></svg> },
  { name: 'Phifer', svg: <svg viewBox="0 0 120 40" fill="currentColor"><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="bold">Phifer</text></svg> },
  { name: 'Hunter Douglas', svg: <svg viewBox="0 0 150 40" fill="currentColor"><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="bold" letterSpacing="1">HunterDouglas</text></svg> },
  { name: 'Fedora', svg: <svg viewBox="0 0 120 40" fill="currentColor"><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="600" letterSpacing="1">FEDORA</text></svg> },
  { name: 'TOSO', svg: <svg viewBox="0 0 120 40" fill="currentColor"><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="900" letterSpacing="3">TOSO</text></svg> },
  { name: 'Marvel', svg: <svg viewBox="0 0 120 40" fill="currentColor"><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="bold" fontStyle="italic">Marvel</text></svg> },
];

export default function BrandCarousel() {
  return (
    <section className="brand-section">
      <div className="container">
        <div className="brand-header">
          <h2>Our Trusted Partners</h2>
          <p>We source only the finest materials and mechanisms from global industry leaders to ensure lasting quality.</p>
        </div>
      </div>
      
      <div className="brand-marquee-container">
        <div className="brand-marquee">
          {/* Double the array for seamless infinite looping */}
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="brand-logo" title={brand.name}>
              {brand.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
