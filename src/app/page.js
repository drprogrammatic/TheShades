import Link from 'next/link';
import BrandCarousel from '@/components/BrandCarousel';
import { LOCAL_ASSETS } from '@/lib/siteAssets';

export const metadata = {
  alternates: { canonical: 'https://theshades.co.in' },
};

const cats = [
  { name: 'Roller Blinds', slug: 'roller-blinds', img: LOCAL_ASSETS.categories['roller-blinds'], sub: 'The most versatile window solution' },
  { name: 'Zebra Blinds', slug: 'zebra-blinds', img: LOCAL_ASSETS.categories['zebra-blinds'], sub: 'Dual-layer elegance' },
  { name: 'Venetian Blinds', slug: 'venetian-blinds', img: LOCAL_ASSETS.categories['venetian-blinds'], sub: 'Classic wood & aluminium' },
  { name: 'Honeycomb Blinds', slug: 'honeycomb-blinds', img: LOCAL_ASSETS.categories['honeycomb-blinds'], sub: 'Energy-efficient cellular shades' },
  { name: 'Curtains & Drapes', slug: 'curtains-drapes', img: LOCAL_ASSETS.categories['curtains-drapes'], sub: 'Premium fabric & motorised tracks' },
  { name: 'Wooden Flooring', slug: 'wooden-flooring', img: LOCAL_ASSETS.categories['wooden-flooring'], sub: 'Hardwood, laminate & woven vinyl' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Homeowner, Gurgaon', text: 'The Shades transformed our living room with beautiful zebra blinds. The installation was seamless, and the quality is outstanding. Highly recommended for anyone looking for premium window solutions.', initials: 'PS' },
  { name: 'Rajesh Kapoor', role: 'Office Manager, Noida', text: 'We outfitted our entire office with motorised roller blinds from The Shades. The remote-controlled operation is incredibly convenient, and the sunscreen fabric has eliminated our screen glare issues completely.', initials: 'RK' },
  { name: 'Ananya Gupta', role: 'Interior Designer, Delhi', text: 'As a designer, I trust The Shades for all my clients\' window treatment needs. Their product range is extensive, the craftsmanship is impeccable, and they always deliver on time. A truly reliable partner.', initials: 'AG' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${LOCAL_ASSETS.hero})` }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-tagline">Style That Hangs With You</p>
          <h1 className="hero-title">Your Space, Reimagined</h1>
          <p className="hero-desc">
            Premium window blinds, designer curtains, luxury wallpapers, and bespoke flooring —
            all custom-crafted for your unique style. Serving Delhi NCR since 2015.
          </p>
          <div className="hero-btns">
            <Link href="/products" className="btn btn-primary">Explore Products</Link>
            <Link href="/contact" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Free Consultation</Link>
          </div>
        </div>
      </section>

      {/* Brands Marquee */}
      <BrandCarousel />

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Collections</h2>
          <p className="section-subtitle">
            From sleek roller blinds to elegant curtain systems — explore our curated range of interior solutions designed for every space and style.
          </p>
          <div className="category-grid">
            {cats.map((cat) => (
              <Link key={cat.slug} href={`/products/${cat.slug}`} className="category-card">
                <img src={cat.img} alt={cat.name} loading="lazy" />
                <div className="category-card-overlay">
                  <h3 className="category-card-title">{cat.name}</h3>
                  <p className="category-card-subtitle">{cat.sub}</p>
                </div>
                <div className="category-card-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <h2 className="section-title">Why Choose The Shades</h2>
          <p className="section-subtitle">
            Seven years of transforming homes and offices across Delhi NCR with unmatched quality and service.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h4>Premium Quality</h4>
              <p>Direct partnerships with leading manufacturers ensure every product meets the highest standards of craftsmanship.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📐</div>
              <h4>Custom Tailored</h4>
              <p>Every solution is measured, designed, and crafted specifically for your windows — no off-the-shelf guesswork.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h4>Expert Installation</h4>
              <p>Our trained technicians handle everything from measurement to installation, ensuring a perfect fit every time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4>Best Value</h4>
              <p>Direct dealership partnerships mean premium products at competitive prices — luxury that doesn't break the bank.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="cta-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
            <div>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>7+</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Years Experience</div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>500+</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects Completed</div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>2000+</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Fabric Options</div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>100%</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Satisfaction</div>
            </div>
          </div>
          <h2>Ready to Transform Your Space?</h2>
          <p>Book a free consultation with our experts. We'll visit your space, understand your vision, and recommend the perfect solutions.</p>
          <Link href="/contact" className="btn btn-primary">Get Free Consultation</Link>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <h2 className="section-title">Register, Request, Track</h2>
          <p className="section-subtitle">
            Your dashboard is the fastest way to work with us online. Create an account, request a quote, and follow every update in one place.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <h4>Create Your Account</h4>
              <p>Register once to open your customer dashboard. Dealer access can be approved later for B2B buyers.</p>
            </div>
            <div className="feature-card">
              <h4>Request a Quote</h4>
              <p>Choose a product or submit a custom requirement with measurements, quantity, and project notes.</p>
            </div>
            <div className="feature-card">
              <h4>Track Every Update</h4>
              <p>Review quote progress, order status, and support replies without leaving the website.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link href="/register" className="btn btn-primary">Create Free Account</Link>
            <Link href="/dashboard/quote-request" className="btn btn-outline">Request a Quote</Link>
            <Link href="/dashboard" className="btn btn-outline">Open Dashboard</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Real stories from homeowners, designers, and businesses who trust The Shades.</p>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Explore Our Full Range</h2>
          <p className="section-subtitle">
            Browse our complete collection of window blinds, curtains, wallpapers, flooring, and outdoor solutions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn-primary">View All Products</Link>
            <Link href="/about" className="btn btn-outline">Our Story</Link>
          </div>
        </div>
      </section>
    </>
  );
}
