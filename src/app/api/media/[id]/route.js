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

    // .lean() converts Mongoose Buffers to BSON Binary — convert back to Buffer
    const buf = Buffer.isBuffer(media.data)
      ? media.data
      : Buffer.from(media.data.buffer ?? media.data);

    return new NextResponse(buf, {
      headers: {
        'Content-Type': media.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(buf.length),
      },
    });
  } catch (err) {
    console.error('Media serve error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
