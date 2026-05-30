'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeSpecifications } from '@/lib/productUtils';
import ImageUploader from '@/components/dashboard/ImageUploader';

const emptyForm = {
  name: '',
  slug: '',
  category: '',
  categorySlug: '',
  description: '',
  shortDescription: '',
  price: '',
  featured: false,
  published: true,
  isB2B: false,
  images: [''],
  features: [''],
  materials: [''],
  useCases: [''],
  faqs: [{ question: '', answer: '' }],
  metaTitle: '',
  metaDescription: '',
  aboutCollection: '',
  specifications: [{ key: '', value: '' }],
  motorizationOptions: [''],
  fabricDetails: '',
};

const categoryMap = {
  'Roller Blinds': 'roller-blinds',
  'Zebra Blinds': 'zebra-blinds',
  'Venetian Blinds': 'venetian-blinds',
  'Honeycomb Blinds': 'honeycomb-blinds',
  'Roman Blinds': 'roman-blinds',
  'Curtains & Drapes': 'curtains-drapes',
  Wallpapers: 'wallpapers',
  'Wooden Flooring': 'wooden-flooring',
  Awnings: 'awnings',
};

function updateArrayField(list, index, value) {
  return list.map((item, currentIndex) => (currentIndex === index ? value : item));
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }

    loadProducts();
  }, [router]);

  async function loadProducts() {
    try {
      const res = await fetch('/api/products?scope=all');
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditProduct(null);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(product) {
    setEditProduct(product);
    setForm({
      ...emptyForm,
      ...product,
      images: product.images?.length ? product.images : [''],
      features: product.features?.length ? product.features : [''],
      materials: product.materials?.length ? product.materials : [''],
      useCases: product.useCases?.length ? product.useCases : [''],
      motorizationOptions: product.motorizationOptions?.length ? product.motorizationOptions : [''],
      faqs: product.faqs?.length ? product.faqs : [{ question: '', answer: '' }],
      specifications: normalizeSpecifications(product).length ? normalizeSpecifications(product) : [{ key: '', value: '' }],
      aboutCollection: product.aboutCollection || '',
      fabricDetails: product.fabricDetails || '',
    });
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const categorySlug = categoryMap[form.category] || form.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const specifications = normalizeSpecifications(form);

    const body = {
      ...form,
      slug,
      categorySlug,
      images: form.images.filter(Boolean),
      features: form.features.filter(Boolean),
      materials: form.materials.filter(Boolean),
      useCases: form.useCases.filter(Boolean),
      motorizationOptions: form.motorizationOptions.filter(Boolean),
      faqs: form.faqs.filter((faq) => faq.question && faq.answer),
      specifications,
      technicalSpecs: specifications.map((spec) => ({
        specKey: spec.key,
        specValue: spec.value,
      })),
    };

    const method = editProduct ? 'PUT' : 'POST';
    const url = editProduct ? `/api/products/${editProduct.slug}` : '/api/products';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    resetForm();
    loadProducts();
  }

  async function handleDelete(slug) {
    if (!confirm('Delete this product?')) return;

    await fetch(`/api/products/${slug}`, { method: 'DELETE' });
    loadProducts();
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Products Catalog</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage B2C and B2B product visibility, pricing, and technical specifications.</p>
        </div>
        <button className="btn btn-primary" onClick={showForm ? () => { setShowForm(false); resetForm(); } : startCreate}>
          {showForm ? 'Close form' : 'Add Product'}
        </button>
      </div>

      {showForm ? (
        <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
          <div className="dashboard-card-header">
            <div>
              <h3>{editProduct ? 'Edit product' : 'New product'}</h3>
              <p>Use the new specification pairs to render the product detail table cleanly.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Product Name *</label>
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                  <option value="">Select category</option>
                  {Object.keys(categoryMap).map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Custom slug</label>
              <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="Optional SEO slug override" />
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <input value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} />
            </div>

            <div className="form-group">
              <label>Full Description *</label>
              <textarea required rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>About Collection (rich text)</label>
                <textarea rows={4} value={form.aboutCollection} onChange={(event) => setForm({ ...form, aboutCollection: event.target.value })} />
              </div>
              <div className="form-group">
                <label>Fabric / Material Details (rich text)</label>
                <textarea rows={4} value={form.fabricDetails} onChange={(event) => setForm({ ...form, fabricDetails: event.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Price</label>
                <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="From Rs 12,000" />
              </div>
              <label className="dashboard-toggle">
                <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
                <span>Featured product</span>
              </label>
              <label className="dashboard-toggle">
                <input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
                <span>Published</span>
              </label>
              <label className="dashboard-toggle">
                <input type="checkbox" checked={form.isB2B} onChange={(event) => setForm({ ...form, isB2B: event.target.checked })} />
                <span>B2B only</span>
              </label>
            </div>

            <div className="form-group">
              <label>Product Images</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {form.images.map((image, index) => (
                  <div key={`image-${index}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: '0.5rem', position: 'relative' }}>
                    <ImageUploader 
                      value={image} 
                      onChange={(url) => setForm({ ...form, images: updateArrayField(form.images, index, url) })} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setForm({ ...form, images: form.images.filter((_, currentIndex) => currentIndex !== index) })}
                      className="btn btn-outline"
                      style={{ color: 'red', borderColor: 'rgba(255, 0, 0, 0.2)' }}
                    >Remove</button>
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-outline" onClick={() => setForm({ ...form, images: [...form.images, ''] })}>Add Another Image</button>
            </div>

            <div className="form-group">
              <label>Features</label>
              {form.features.map((feature, index) => (
                <div key={`feature-${index}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    value={feature}
                    onChange={(event) => setForm({ ...form, features: updateArrayField(form.features, index, event.target.value) })}
                    placeholder="Feature"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, currentIndex) => currentIndex !== index) })}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn btn-outline" onClick={() => setForm({ ...form, features: [...form.features, ''] })}>Add Feature</button>
            </div>

            <div className="form-group">
              <label>Specifications</label>
              {form.specifications.map((spec, index) => (
                <div key={`spec-${index}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    value={spec.key}
                    onChange={(event) => {
                      const specifications = [...form.specifications];
                      specifications[index] = { ...specifications[index], key: event.target.value };
                      setForm({ ...form, specifications });
                    }}
                    placeholder="Key"
                  />
                  <input
                    value={spec.value}
                    onChange={(event) => {
                      const specifications = [...form.specifications];
                      specifications[index] = { ...specifications[index], value: event.target.value };
                      setForm({ ...form, specifications });
                    }}
                    placeholder="Value"
                  />
                  <button type="button" onClick={() => setForm({ ...form, specifications: form.specifications.filter((_, currentIndex) => currentIndex !== index) })}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn btn-outline" onClick={() => setForm({ ...form, specifications: [...form.specifications, { key: '', value: '' }] })}>Add Spec</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Materials</label>
                {form.materials.map((material, index) => (
                  <div key={`material-${index}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      value={material}
                      onChange={(event) => setForm({ ...form, materials: updateArrayField(form.materials, index, event.target.value) })}
                      placeholder="Material"
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={() => setForm({ ...form, materials: form.materials.filter((_, currentIndex) => currentIndex !== index) })}>Remove</button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={() => setForm({ ...form, materials: [...form.materials, ''] })}>Add Material</button>
              </div>

              <div className="form-group">
                <label>Use Cases</label>
                {form.useCases.map((useCase, index) => (
                  <div key={`use-case-${index}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      value={useCase}
                      onChange={(event) => setForm({ ...form, useCases: updateArrayField(form.useCases, index, event.target.value) })}
                      placeholder="Use case"
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={() => setForm({ ...form, useCases: form.useCases.filter((_, currentIndex) => currentIndex !== index) })}>Remove</button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={() => setForm({ ...form, useCases: [...form.useCases, ''] })}>Add Use Case</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Motorization Options</label>
                {form.motorizationOptions.map((option, index) => (
                  <div key={`motor-${index}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      value={option}
                      onChange={(event) => setForm({ ...form, motorizationOptions: updateArrayField(form.motorizationOptions, index, event.target.value) })}
                      placeholder="Option"
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={() => setForm({ ...form, motorizationOptions: form.motorizationOptions.filter((_, currentIndex) => currentIndex !== index) })}>Remove</button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={() => setForm({ ...form, motorizationOptions: [...form.motorizationOptions, ''] })}>Add Option</button>
              </div>

              <div className="form-group">
                <label>FAQs</label>
                {form.faqs.map((faq, index) => (
                  <div key={`faq-${index}`} style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      value={faq.question}
                      onChange={(event) => {
                        const faqs = [...form.faqs];
                        faqs[index] = { ...faqs[index], question: event.target.value };
                        setForm({ ...form, faqs });
                      }}
                      placeholder="Question"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(event) => {
                        const faqs = [...form.faqs];
                        faqs[index] = { ...faqs[index], answer: event.target.value };
                        setForm({ ...form, faqs });
                      }}
                      placeholder="Answer"
                    />
                    <button type="button" onClick={() => setForm({ ...form, faqs: form.faqs.filter((_, currentIndex) => currentIndex !== index) })}>Remove</button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={() => setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] })}>Add FAQ</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>SEO Meta Title</label>
                <input value={form.metaTitle} onChange={(event) => setForm({ ...form, metaTitle: event.target.value })} />
              </div>
              <div className="form-group">
                <label>SEO Meta Description</label>
                <input value={form.metaDescription} onChange={(event) => setForm({ ...form, metaDescription: event.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">{editProduct ? 'Update Product' : 'Create Product'}</button>
              <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Visibility</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</td></tr>
          ) : !products.length ? (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No products yet.</td></tr>
          ) : (
            products.map((product) => (
              <tr key={product._id || product.slug}>
                <td>
                  <strong>{product.name}</strong>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{product.slug}</div>
                </td>
                <td>{product.category}</td>
                <td>{product.isB2B ? 'B2B only' : 'B2C + B2B'}</td>
                <td>{product.published ? 'Published' : 'Draft'}</td>
                <td>{product.price || 'Quote on request'}</td>
                <td className="admin-actions">
                  <button className="btn-edit" onClick={() => startEdit(product)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(product.slug)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
