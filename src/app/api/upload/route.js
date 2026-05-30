import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';

// Max 8MB per upload
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 8MB.' }, { status: 400 });
    }

    const contentType = file.type || 'image/jpeg';
    const originalName = (file.name || 'image.jpg').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${Date.now()}-${originalName}`;

    await dbConnect();
    const media = await Media.create({
      filename,
      contentType,
      data: buffer,
      size: buffer.length,
    });

    const url = `/api/media/${media._id}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}
