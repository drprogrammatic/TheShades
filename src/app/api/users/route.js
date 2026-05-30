import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSessionUserFromCookies } from '@/lib/serverAuth';

export async function GET() {
  try {
    const admin = await getSessionUserFromCookies();
    if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = await getSessionUserFromCookies();
    if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id, role } = await req.json();

    if (!id || !['customer', 'dealer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    return NextResponse.json({ user: updatedUser, message: 'Role updated' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
