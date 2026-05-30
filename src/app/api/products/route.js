import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getSessionClaimsFromRequest, getSessionUserFromRequest } from '@/lib/serverAuth';
import { isB2BProductVisibleToUser, normalizeProductPayload } from '@/lib/productUtils';
import { localizeImages } from '@/lib/siteAssets';

export async function GET(request) {
  try {
    const user = getSessionClaimsFromRequest(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const scope = searchParams.get('scope');
    const query = {};

    if (category) query.categorySlug = category;
    if (featured === 'true') query.featured = true;

    if (scope === 'all') {
      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      query.published = true;
      if (!isB2BProductVisibleToUser(user)) {
        query.isB2B = { $ne: true };
      }
    }

    await dbConnect();
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        images: localizeImages(product.images || []),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = normalizeProductPayload(await request.json());
    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
