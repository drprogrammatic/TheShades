import Link from 'next/link';

export const metadata = {
  title: 'About Us — Our Story & Mission',
  description: 'Learn about The Shades — 7+ years transforming spaces across Delhi NCR with premium window blinds, curtains, wallpapers & flooring. Our story, mission & values.',
};

export default function AboutPage() {
  return (
    <>
      <section className="page-header">
        <div className="page-header-content container">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>About Us</span>
          </div>
          <h1>About The Shades</h1>
          <p>Committed to excellence in interior décor since 2015</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2>Our Story</h2>
          <p style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Founded in 2015, The Shades was born from a simple belief: every space deserves to look and feel extraordinary. What started as a small window blinds business in Delhi has grown into one of the NCR's most trusted names in interior décor — delivering premium window coverings, curtains, wallpapers, and flooring solutions to hundreds of satisfied clients.
          </p>
          <p style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Over seven years, we have earned our reputation through an unwavering commitment to quality, transparency, and personalised service. We don't just sell products — we listen to your vision, study your space, and craft tailored solutions that elevate your environment from ordinary to exceptional.
          </p>

          <div style={{ background: 'var(--color-bg-alt)', padding: '2rem', borderRadius: '12px', margin: '2rem 0' }}>
            <h3 style={{ marginBottom: '1rem' }}>Our Mission</h3>
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.8 }}>
              "To make premium interior design accessible to every home and office in India — delivering world-class window treatments and décor solutions with honesty, expertise, and an obsession for quality."
            </p>
          </div>

          <h2 style={{ marginTop: '2.5rem' }}>What Sets Us Apart</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', margin: '1.5rem 0' }}>
            <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>Direct Brand Partnerships</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)' }}>
                We hold direct dealership partnerships with industry leaders including MAC and other premium manufacturers. This means you get authentic, high-quality products at competitive prices — no middlemen.
              </p>
            </div>
            <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>End-to-End Service</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)' }}>
                From the initial consultation and site measurement to fabrication, delivery, and professional installation — we handle everything. You sit back and watch your space transform.
              </p>
            </div>
            <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>500+ Successful Projects</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)' }}>
                From cosy studio apartments to sprawling corporate offices, we've delivered hundreds of projects across Delhi, Gurgaon, Noida, Faridabad, and Ghaziabad.
              </p>
            </div>
            <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>2000+ Fabric Choices</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)' }}>
                Our catalogue spans over 2000 fabrics, textures, and finishes. Whatever your style — minimalist, classic, bold, or subtle — we have the perfect match waiting for you.
              </p>
            </div>
          </div>

          <h2 style={{ marginTop: '2.5rem' }}>Our Process</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', margin: '1.5rem 0', textAlign: 'center' }}>
            {[
              { step: '01', title: 'Consult', desc: 'Share your vision and requirements with our design experts.' },
              { step: '02', title: 'Measure', desc: 'We visit your site for precise measurements and assessment.' },
              { step: '03', title: 'Craft', desc: 'Your products are custom-fabricated to exact specifications.' },
              { step: '04', title: 'Install', desc: 'Professional installation with quality assurance.' },
            ].map(s => (
              <div key={s.step}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.2rem', fontWeight: 700 }}>{s.step}</div>
                <h4>{s.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Let's Create Something Beautiful Together</h2>
          <p>Schedule a free consultation and let our team bring your interior vision to life.</p>
          <Link href="/contact" className="btn btn-primary">Get In Touch</Link>
        </div>
      </section>
    </>
  );
}
