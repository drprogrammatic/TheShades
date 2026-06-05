import { NextResponse } from 'next/server';

const MAX_SIZE = 4 * 1024 * 1024; // 4MB — safe under Vercel's 4.5MB limit

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
      return NextResponse.json({ error: 'File too large. Maximum size is 4MB.' }, { status: 400 });
    }

    const contentType = file.type || 'image/jpeg';
    const originalName = (file.name || 'image.jpg').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${Date.now()}-${originalName}`;

    // Lazy-import so a missing MONGODB_URI doesn't crash the module at load time
    const { default: dbConnect } = await import('@/lib/mongodb');
    const { default: Media } = await import('@/models/Media');

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
    return NextResponse.json({ error: err.message || 'Server error during upload' }, { status: 500 });
  }
}
