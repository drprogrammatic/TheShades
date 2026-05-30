import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export const metadata = {
  title: 'Blog — Interior Design Tips & Window Treatment Guides',
  description: 'Expert tips on window blinds, curtains, interior design trends and home décor inspiration for Indian homes. By The Shades Delhi NCR.',
  alternates: { canonical: 'https://theshades.co.in/blog' },
};

async function getPosts() {
  try {
    await dbConnect();
    const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 }).lean();
    return posts.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="page-header">
        <div className="page-header-content container">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Blog</span>
          </div>
          <h1>Design Insights &amp; Guides</h1>
          <p>Expert tips on window treatments, interior design trends, and home décor inspiration</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h3>No blog posts yet</h3>
              <p style={{ color: 'var(--color-text-light)', margin: '1rem 0' }}>
                We&apos;re crafting insightful articles. Check back soon!
              </p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card" style={{ textDecoration: 'none' }}>
                  <div className="blog-card-image">
                    <img
                      src={post.featuredImage || '/assets/placeholders/product-placeholder.svg'}
                      alt={post.title}
                      loading="lazy"
                      style={{ background: 'var(--color-bg-alt)', minHeight: '180px' }}
                    />
                  </div>
                  <div className="blog-card-body">
                    <p className="blog-card-date">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                        : 'Recent'}
                    </p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Need Expert Advice?</h2>
          <p>Our team is happy to help you choose the perfect window treatments for your space.</p>
          <Link href="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
