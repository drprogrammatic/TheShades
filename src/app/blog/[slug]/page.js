import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

// PubClarity ad-tag test: only this one article loads the tag + ad slot for now.
const PC_TEST_SLUG = 'transform-your-home-in-2026-modern-decor-ideas-that-elevate-every-space';
const PC_SITE_KEY = 'pc_theshades_zi33vw';

async function getPost(slug) {
  try {
    await dbConnect();
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) return null;
    return {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString() || null,
      updatedAt: post.updatedAt?.toISOString() || null,
    };
  } catch {
    return null;
  }
}

async function getRelated(currentSlug) {
  try {
    await dbConnect();
    const posts = await BlogPost.find({ published: true, slug: { $ne: currentSlug } })
      .sort({ createdAt: -1 }).limit(2).lean();
    return posts.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString() || null,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  const url = `https://theshades.co.in/blog/${params.slug}`;
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    alternates: { canonical: url },
    openGraph: {
      url,
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || '',
      type: 'article',
      publishedTime: post.createdAt,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const relatedPosts = await getRelated(params.slug);
  const pcAdsEnabled = params.slug === PC_TEST_SLUG;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || '',
    image: post.featuredImage || '',
    author: { "@type": "Organization", name: post.author || 'The Shades Team' },
    publisher: {
      "@type": "Organization",
      name: "The Shades",
      logo: { "@type": "ImageObject", url: "https://theshades.co.in/logo.png" }
    },
    datePublished: post.createdAt || '',
    dateModified: post.updatedAt || post.createdAt || '',
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://theshades.co.in/blog/${params.slug}` },
  };

  return (
    <>
      <article className="legal-page">
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
            <Link href="/">Home</Link>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <Link href="/blog">Blog</Link>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span>{post.title}</span>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
              : ''}{' '}
            · By {post.author || 'The Shades Team'}
          </p>

          <h1>{post.title}</h1>

          {/* PubClarity video player — ABOVE THE FOLD (right under the headline).
              The page ships an empty div; tag.js builds the IMA player into it and
              docks it as a floater on scroll. data-pc-type declares the slot type. */}
          {pcAdsEnabled && (
            <div
              data-pc-slot="article_video"
              data-pc-type="video"
              style={{ margin: '1.5rem auto', maxWidth: 640, aspectRatio: '16 / 9', borderRadius: 12 }}
            />
          )}

          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0', maxHeight: '400px', objectFit: 'cover' }}
            />
          )}

          <div className="rich-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Display leaderboard — below the article body */}
          {pcAdsEnabled && (
            <div
              data-pc-slot="leaderboard"
              style={{ margin: '2rem auto', maxWidth: 728, minHeight: 90 }}
            />
          )}

          {post.tags?.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ background: 'var(--color-bg-alt)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Related Articles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {relatedPosts.map(rp => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="blog-card" style={{ textDecoration: 'none' }}>
                    <div className="blog-card-image">
                      <img
                        src={rp.featuredImage || '/assets/placeholders/product-placeholder.svg'}
                        alt={rp.title}
                        loading="lazy"
                        style={{ background: 'var(--color-bg-alt)', minHeight: '120px' }}
                      />
                    </div>
                    <div className="blog-card-body">
                      <h3 style={{ fontSize: '1rem' }}>{rp.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                        {rp.excerpt?.substring(0, 100)}...
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--color-bg-alt)', borderRadius: '12px', textAlign: 'center' }}>
            <h3>Need Expert Advice?</h3>
            <p style={{ color: 'var(--color-text-light)', margin: '0.5rem 0 1rem' }}>
              Our team is happy to help you choose the perfect solutions for your space.
            </p>
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* PubClarity tag loader — test article only */}
      {pcAdsEnabled && (
        <Script
          async
          src="https://pubclarity.com/tag.js"
          data-site={PC_SITE_KEY}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
