import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as seedProducts } from '@/lib/seedData';
import { getSessionClaimsFromCookies } from '@/lib/serverAuth';
import { isB2BProductVisibleToUser, normalizeProductPayload } from '@/lib/productUtils';
import { localizeImagePath, localizeImages } from '@/lib/siteAssets';

function sanitizeSeedProduct(product) {
  const normalized = normalizeProductPayload({
    ...product,
    _id: product.slug,
    published: product.published ?? true,
  });

  return {
    ...normalized,
    images: localizeImages(normalized.images),
  };
}

function sanitizeDbProduct(product) {
  const normalized = normalizeProductPayload(product);

  return {
    ...normalized,
    images: localizeImages(normalized.images),
    image: localizeImagePath(normalized.image),
  };
}

async function getViewer() {
  try {
    return getSessionClaimsFromCookies();
  } catch {
    return null;
  }
}

export async function getVisibleProductsByCategory(categorySlug) {
  const viewer = await getViewer();

  try {
    await dbConnect();

    const query = {
      categorySlug,
      published: true,
    };

    if (!isB2BProductVisibleToUser(viewer)) {
      query.isB2B = { $ne: true };
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    if (products.length) {
      return products.map((product) => sanitizeDbProduct(product));
    }
  } catch {
    // Fall back to seed data below if the database is unavailable.
  }

  return seedProducts
    .filter((product) => product.categorySlug === categorySlug)
    .map((product) => sanitizeSeedProduct(product))
    .filter((product) => isB2BProductVisibleToUser(viewer) || !product.isB2B);
}

export async function getVisibleProductBySlug(slug) {
  const viewer = await getViewer();

  try {
    await dbConnect();

    const query = {
      slug,
      published: true,
    };

    if (!isB2BProductVisibleToUser(viewer)) {
      query.isB2B = { $ne: true };
    }

    const product = await Product.findOne(query).lean();
    if (product) {
      return sanitizeDbProduct(product);
    }
  } catch {
    // Fall back to seed data below if the database is unavailable.
  }

  const seedProduct = seedProducts.find((product) => product.slug === slug);
  if (!seedProduct) return null;

  const sanitized = sanitizeSeedProduct(seedProduct);
  if (!isB2BProductVisibleToUser(viewer) && sanitized.isB2B) {
    return null;
  }

  return sanitized;
}
