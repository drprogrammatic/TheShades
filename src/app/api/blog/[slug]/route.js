import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { localizeImagePath } from '@/lib/siteAssets';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({
      post: {
        ...post,
        featuredImage: localizeImagePath(post.featuredImage),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const body = await request.json();
    const post = await BlogPost.findOneAndUpdate({ slug }, body, { new: true });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    await BlogPost.findOneAndDelete({ slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
