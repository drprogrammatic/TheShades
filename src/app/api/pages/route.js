import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';
import { getSessionUserFromCookies } from '@/lib/serverAuth';

export async function GET() {
  try {
    const user = await getSessionUserFromCookies();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const pages = await Page.find().sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ pages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getSessionUserFromCookies();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const page = await Page.create(body);
    return NextResponse.json({ page, message: 'Page created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getSessionUserFromCookies();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const page = await Page.findByIdAndUpdate(id, updates, { new: true });
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page, message: 'Page updated' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = await getSessionUserFromCookies();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    await Page.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Page deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
