import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getSessionClaimsFromRequest, getSessionUserFromRequest } from '@/lib/serverAuth';
import { isB2BProductVisibleToUser, normalizeProductPayload } from '@/lib/productUtils';
import { localizeImages } from '@/lib/siteAssets';

export async function GET(request, { params }) {
  try {
    const user = getSessionClaimsFromRequest(request);
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');
    const query = { slug };

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
    const product = await Product.findOne(query).lean();
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({
      product: {
        ...product,
        images: localizeImages(product.images || []),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getSessionUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    const body = normalizeProductPayload(await request.json());
    const product = await Product.findOneAndUpdate({ slug }, body, { new: true });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getSessionUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    await Product.findOneAndDelete({ slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
