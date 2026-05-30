import Link from 'next/link';
import { categories as seedCategories } from '@/lib/seedData';
import { getVisibleProductsByCategory } from '@/lib/catalog';
import { LOCAL_ASSETS, localizeImagePath } from '@/lib/siteAssets';

const META = {
  'roller-blinds':    { title: 'Roller Blinds in Delhi | Blackout, Sunscreen, Custom', description: 'Premium roller blinds in Delhi — blackout, sunscreen & light-filtering. 500+ fabric options. Custom-made & professionally installed. Book a free home visit.' },
  'zebra-blinds':     { title: 'Zebra Blinds Delhi NCR | Vision Blinds Custom Made',   description: 'Zebra (dual-layer vision) blinds in Delhi NCR. Elegant light control, custom sizes, expert installation. 7+ years expertise. Book a free consultation.' },
  'venetian-blinds':  { title: 'Venetian Blinds Delhi | Wood & Aluminium Custom',      description: 'Wooden & aluminium venetian blinds in Delhi. Custom-made, professionally installed. Best prices in Dwarka, Gurgaon & Noida. Free site visit.' },
  'honeycomb-blinds': { title: 'Honeycomb Blinds Delhi | Energy Efficient Cellular',   description: 'Energy-efficient honeycomb (cellular) blinds in Delhi NCR. Reduce heat by up to 40%. Custom sizes. Free consultation & installation.' },
  'roman-blinds':     { title: 'Roman Blinds Delhi NCR | Premium Fabric Custom Made',  description: 'Elegant roman blinds in Delhi. Premium fabric options, custom sizes, expert installation. Transform your windows — book a free consultation.' },
  'curtains-drapes':  { title: 'Curtains & Drapes Delhi | Motorised & Custom Fabric',  description: 'Designer curtains & motorised drape tracks in Delhi NCR. Custom fabric selection, expert installation. Book a free home consultation today.' },
  wallpapers:         { title: 'Wallpapers Delhi NCR | 1000+ Designs Professional Install', description: 'Premium imported & Indian wallpapers in Delhi NCR. 1000+ design options. Professional installation. Free sample & consultation available.' },
  'wooden-flooring':  { title: 'Wooden Flooring Delhi | Hardwood, Laminate & Vinyl',   description: 'Hardwood, laminate & vinyl flooring in Delhi NCR. Custom installation by certified professionals. Get a free estimate for your project today.' },
  awnings:            { title: 'Awnings Delhi NCR | Retractable & Fixed Outdoor',      description: 'Premium retractable & fixed awnings for homes and offices in Delhi NCR. UV protection, custom sizes. Book a free consultation.' },
};

export async function generateMetadata({ params }) {
  const { category } = params;
  const m = META[category] || {};
  const url = `https://theshades.co.in/products/${category}`;
  return {
    title: m.title || `${category.replace(/-/g, ' ')} | The Shades`,
    description: m.description || '',
    alternates: { canonical: url },
    openGraph: { url, title: m.title, description: m.description },
  };
}

const categoryInfo = {};
seedCategories.forEach((category) => {
  categoryInfo[category.slug] = {
    name: category.name,
    desc: category.description,
    image: category.image,
    icon: category.icon,
  };
});

export default async function CategoryPage({ params }) {
  const { category } = params;
  const products = await getVisibleProductsByCategory(category);
  const info = categoryInfo[category] || { name: category, desc: '' };

  return (
    <>
      <section className="page-header">
        <div className="page-header-content container">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/products">Products</Link><span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{info.name}</span>
          </div>
          <h1>{info.name}</h1>
          <p>{info.desc}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!products.length ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h3>No products found in this category yet</h3>
              <p style={{ color: 'var(--color-text-light)', margin: '1rem 0 2rem' }}>
                We&apos;re adding new products regularly. Check back soon or contact us for custom orders.
              </p>
              <Link href="/contact" className="btn btn-primary">Request Custom Order</Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link key={product.slug} href={`/products/${category}/${product.slug}`} className="product-card" style={{ textDecoration: 'none' }}>
                  <div className="product-card-image">
                    <img src={localizeImagePath(product.images?.[0], LOCAL_ASSETS.placeholder)} alt={product.name} loading="lazy" style={{ background: 'var(--color-bg-alt)', minHeight: '200px' }} />
                    {product.featured ? <span className="product-card-badge">Featured</span> : null}
                    {product.isB2B ? <span className="dashboard-product-pill" style={{ right: '1rem', left: 'auto' }}>B2B</span> : null}
                  </div>
                  <div className="product-card-body">
                    <p className="product-card-category">{product.category}</p>
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-desc">{product.shortDescription || `${product.description?.substring(0, 120)}...`}</p>
                  </div>
                  <div className="product-card-footer">
                    <span className="product-card-price">{product.price}</span>
                    <span className="product-card-link">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {info.desc ? (
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 className="section-title">About {info.name}</h2>
            <p style={{ textAlign: 'center', lineHeight: 1.8, color: 'var(--color-text-light)' }}>
              {info.desc}
            </p>
          </div>
        </section>
      ) : null}

      <section className="cta-section">
        <div className="container">
          <h2>Need Help Choosing?</h2>
          <p>Our experts will help you select the perfect {info.name.toLowerCase()} for your space. Free, no-obligation consultation.</p>
          <Link href="/contact" className="btn btn-primary">Book Free Consultation</Link>
        </div>
      </section>
    </>
  );
}
