import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

const BASE = 'https://theshades.co.in';

const CATEGORIES = [
  'roller-blinds','zebra-blinds','venetian-blinds','honeycomb-blinds',
  'roman-blinds','curtains-drapes','wallpapers','wooden-flooring','awnings',
];

async function getBlogSlugs() {
  try {
    await dbConnect();
    const posts = await BlogPost.find({ published: true }, { slug: 1, updatedAt: 1 }).lean();
    return posts;
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const blogPosts = await getBlogSlugs();

  const staticPages = [
    { url: BASE,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/products`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/blog`,           lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/about`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const categoryPages = CATEGORIES.map(cat => ({
    url: `${BASE}/products/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogPages = blogPosts.map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...blogPages];
}
