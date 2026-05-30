import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { localizeImagePath } from '@/lib/siteAssets';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');
    const filter = scope === 'all' ? {} : { published: true };
    const posts = await BlogPost.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      posts: posts.map((post) => ({
        ...post,
        featuredImage: localizeImagePath(post.featuredImage),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const post = await BlogPost.create(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
