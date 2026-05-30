'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { normalizeSpecifications } from '@/lib/productUtils';
import { LOCAL_ASSETS, localizeImagePath, localizeImages } from '@/lib/siteAssets';

export default function ProductDetailsClient({ initialProduct, slug, category }) {
  const router = useRouter();
  const product = initialProduct
    ? {
        ...initialProduct,
        images: localizeImages(initialProduct.images || []),
      }
    : null;
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImage, setActiveImage] = useState(0);
  const [quoteState, setQuoteState] = useState({ loading: false, error: '', success: '' });

  const specifications = normalizeSpecifications(product || {});
  const currentImage = product?.images?.[activeImage] || product?.images?.[0] || LOCAL_ASSETS.placeholder;
  const resolvedCategory = product?.categorySlug || category || product?.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'products';

  const tabs = [{ id: 'overview', label: 'Overview' }];
  if (product?.features?.length) tabs.push({ id: 'features', label: 'Features' });
  if (specifications.length) tabs.push({ id: 'specs', label: 'Specifications' });
  if (product?.fabricDetails || product?.materials?.length) tabs.push({ id: 'materials', label: 'Materials' });
  if (product?.motorizationOptions?.length) tabs.push({ id: 'motorization', label: 'Motorization' });

  async function handleRequestQuote() {
    const token = localStorage.getItem('token');
    if (!token) {
      const quotePath = `/dashboard/quote-request${product?._id ? `?product=${encodeURIComponent(product._id)}` : ''}`;
      router.push(`/login?redirect=${encodeURIComponent(quotePath)}`);
      return;
    }

    setQuoteState({ loading: true, error: '', success: '' });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [{
            productId: product?._id || null,
            name: product?.name || 'Custom product',
            quantity: 1,
            notes: 'Requested directly from product detail page',
          }],
          notes: `Quote request for ${product?.name || 'selected product'}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to submit quote request');
      }

      setQuoteState({
        loading: false,
        error: '',
        success: 'Quote request submitted. You can track it from your dashboard.',
      });

      setTimeout(() => router.push('/dashboard/quotes'), 1800);
    } catch (error) {
      setQuoteState({
        loading: false,
        error: error.message,
        success: '',
      });
    }
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <h2>Product not found</h2>
          <p style={{ color: 'var(--color-text-light)', margin: '1rem 0 2rem' }}>
            The product you are looking for is not available right now.
          </p>
          <Link href="/products" className="btn btn-primary">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-hero" style={{ background: 'var(--color-bg-alt)', padding: '4rem 0' }}>
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: 'flex-start', marginBottom: '2rem', fontSize: '0.9rem' }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Products</Link>
            <span>/</span>
            <Link href={`/products/${resolvedCategory}`}>{product.category}</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
            <div className="product-gallery">
              <div className="product-gallery-main" style={{ borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: '#fff' }}>
                <img src={currentImage} alt={product.name} style={{ width: '100%', objectFit: 'cover', aspectRatio: '4/3' }} />
              </div>
              {product.images?.length > 1 ? (
                <div className="product-gallery-thumbs" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {product.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={`product-gallery-thumb ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                      style={{ width: 86, height: 86, flexShrink: 0 }}
                    >
                      <img src={localizeImagePath(image)} alt={`${product.name} ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="product-hero-info">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <p style={{ color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', margin: 0 }}>
                  {product.category}
                </p>
                {product.isB2B ? <span className="dashboard-product-pill">Dealer-exclusive</span> : null}
              </div>

              <h1 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', marginBottom: '1rem', lineHeight: 1.1 }}>{product.name}</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                {product.shortDescription || product.description}
              </p>

              {quoteState.error ? <div className="dashboard-alert danger">{quoteState.error}</div> : null}
              {quoteState.success ? <div className="dashboard-alert success">{quoteState.success}</div> : null}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button type="button" className="btn btn-primary" onClick={handleRequestQuote} disabled={quoteState.loading}>
                  {quoteState.loading ? 'Submitting...' : 'Request Quote'}
                </button>
                <Link href="/dashboard/quote-request" className="btn btn-outline">
                  Add project details
                </Link>
              </div>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                Register once to request quotes online and track everything from your personal dashboard.
              </p>

              {product.price ? (
                <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Starting from <strong style={{ color: 'var(--color-heading)' }}>{product.price}</strong>
                </p>
              ) : null}

              <div className="product-highlight-grid">
                <div>
                  <span>Specifications</span>
                  <strong>{specifications.length || 'Custom'}</strong>
                </div>
                <div>
                  <span>Materials</span>
                  <strong>{product.materials?.length || 'On request'}</strong>
                </div>
                <div>
                  <span>Use cases</span>
                  <strong>{product.useCases?.length || 'Flexible'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-tabs-wrapper" style={{ position: 'sticky', top: 'var(--header-height, 80px)', background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-border)', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'product-tab-button active' : 'product-tab-button'}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-tab-content section" style={{ minHeight: 400, background: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: 980, margin: '0 auto' }}>
          {activeTab === 'overview' ? (
            <div className="tab-pane animate-fade-in">
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>About {product.name}</h2>
              <div className="rich-content" style={{ fontSize: '1.05rem', lineHeight: 1.9, color: 'var(--color-text)' }}>
                {product.aboutCollection ? (
                  <div dangerouslySetInnerHTML={{ __html: product.aboutCollection }} />
                ) : (
                  <p>{product.description}</p>
                )}
              </div>

              {product.useCases?.length ? (
                <div style={{ marginTop: '3rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Ideal applications</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                    {product.useCases.map((useCase) => (
                      <span key={useCase} className="dashboard-chip">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {activeTab === 'features' ? (
            <div className="tab-pane animate-fade-in">
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Key features</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {product.features.map((feature) => (
                  <div key={feature} className="dashboard-card" style={{ minHeight: 0 }}>
                    <div className="dashboard-note">
                      <strong>{feature}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === 'specs' ? (
            <div className="tab-pane animate-fade-in">
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Specifications table</h2>
              <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr key={`${spec.key}-${index}`} style={{ background: index % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(243,241,237,0.7)' }}>
                        <td style={{ padding: '1rem 1.25rem', width: '36%', fontWeight: 600, color: 'var(--color-heading)' }}>{spec.key}</td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text)' }}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeTab === 'materials' ? (
            <div className="tab-pane animate-fade-in">
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Materials and finish</h2>
              {product.fabricDetails ? (
                <div className="rich-content" dangerouslySetInnerHTML={{ __html: product.fabricDetails }} />
              ) : null}
              {product.materials?.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
                  {product.materials.map((material) => (
                    <span key={material} className="dashboard-chip">
                      {material}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {activeTab === 'motorization' ? (
            <div className="tab-pane animate-fade-in">
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Motorization and controls</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {product.motorizationOptions.map((option) => (
                  <div key={option} className="dashboard-card" style={{ minHeight: 0 }}>
                    <div className="dashboard-note">
                      <strong>{option}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
