import Link from 'next/link';
import { LOCAL_ASSETS } from '@/lib/siteAssets';

export const metadata = {
  title: 'All Products — Window Blinds, Curtains, Wallpapers & Flooring',
  description: 'Explore our full range of premium window blinds, curtains, wallpapers, wooden flooring & awnings. Custom-made solutions for homes and offices in Delhi NCR.',
};

const categories = [
  { name: 'Roller Blinds', slug: 'roller-blinds', img: LOCAL_ASSETS.categories['roller-blinds'], desc: 'Sleek, versatile, and available in light-filtering, sunscreen, and blackout options.' },
  { name: 'Zebra Blinds', slug: 'zebra-blinds', img: LOCAL_ASSETS.categories['zebra-blinds'], desc: 'Dual-layer alternating bands for elegant day-to-night light control.' },
  { name: 'Venetian Blinds', slug: 'venetian-blinds', img: LOCAL_ASSETS.categories['venetian-blinds'], desc: 'Timeless wood and aluminium slats with precision tilt control.' },
  { name: 'Honeycomb Blinds', slug: 'honeycomb-blinds', img: LOCAL_ASSETS.categories['honeycomb-blinds'], desc: 'Energy-efficient cellular construction for insulation and comfort.' },
  { name: 'Roman Blinds', slug: 'roman-blinds', img: LOCAL_ASSETS.categories['roman-blinds'], desc: 'Soft fabric elegance with structured horizontal folds.' },
  { name: 'Curtains & Drapes', slug: 'curtains-drapes', img: LOCAL_ASSETS.categories['curtains-drapes'], desc: 'Premium fabrics, motorised tracks, and designer curtain systems.' },
  { name: 'Wallpapers', slug: 'wallpapers', img: LOCAL_ASSETS.categories.wallpapers, desc: 'Designer textures, metallics, and custom prints for every aesthetic.' },
  { name: 'Wooden Flooring', slug: 'wooden-flooring', img: LOCAL_ASSETS.categories['wooden-flooring'], desc: 'Engineered hardwood, laminate, and woven vinyl flooring.' },
  { name: 'Awnings', slug: 'awnings', img: LOCAL_ASSETS.categories.awnings, desc: 'Retractable and fixed outdoor sun protection.' },
];

export default function ProductsPage() {
  return (
    <>
      <section className="page-header">
        <div className="page-header-content container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Products</span>
          </div>
          <h1>Our Product Range</h1>
          <p>
            Explore our comprehensive collection of window coverings and interior solutions.
            Every product is custom-made to your specifications.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="category-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products/${cat.slug}`} className="category-card">
                <img src={cat.img} alt={cat.name} loading="lazy" style={{ background: 'var(--color-bg-alt)', minHeight: '200px' }} />
                <div className="category-card-overlay">
                  <h3 className="category-card-title">{cat.name}</h3>
                  <p className="category-card-subtitle">{cat.desc}</p>
                </div>
                <div className="category-card-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Can't Find What You're Looking For?</h2>
          <p>Our experts can help you find the perfect solution. Book a free consultation today.</p>
          <Link href="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
