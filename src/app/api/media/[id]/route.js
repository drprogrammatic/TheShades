import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const media = await Media.findById(params.id).lean();

    if (!media) {
      return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(media.data, {
      headers: {
        'Content-Type': media.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(media.size || media.data.length),
      },
    });
  } catch (err) {
    console.error('Media serve error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
