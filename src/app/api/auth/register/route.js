import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, phone, company } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already registered' }, { status: 400 });
    }

    // Determine role (first user becomes admin, rest become customer)
    const count = await User.countDocuments();
    const role = count === 0 ? 'admin' : 'customer';

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || '',
      company: company || ''
    });

    return NextResponse.json({
      message: role === 'customer'
        ? 'Account created successfully. Dealer access can be enabled later by an admin.'
        : 'Account created successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Server configuration error or bad request' }, { status: 500 });
  }
}
