import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getSessionUserFromCookies } from '@/lib/serverAuth';

export async function GET() {
  try {
    const user = await getSessionUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    // Admin sees all, otherwise user sees their own
    const query = user.role === 'admin' ? {} : { user: user._id };
    const orders = await Order.find(query).populate('user', 'name company email phone').sort({ createdAt: -1 });
    
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getSessionUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { products, notes } = await req.json();

    if (!products || !products.length) {
      return NextResponse.json({ error: 'Products are required' }, { status: 400 });
    }

    const order = await Order.create({
      user: user._id,
      products,
      notes,
      status: 'Pending Quote'
    });

    return NextResponse.json({ order, message: 'Quote request submitted!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getSessionUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id, status, quoteAmount, billUrl } = await req.json();

    if (!id) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Admins can update everything. Customers/dealers can only accept/cancel.
    if (user.role === 'admin') {
      if (status) order.status = status;
      if (quoteAmount !== undefined) order.quoteAmount = quoteAmount;
      if (billUrl !== undefined) order.billUrl = billUrl;
    } else {
      // User can only change status to Accepted or Cancelled if it is Quoted or Pending
      if (status === 'Accepted' && order.status === 'Quoted') {
        order.status = 'Accepted';
      } else if (status === 'Cancelled' && ['Pending Quote', 'Quoted'].includes(order.status)) {
        order.status = 'Cancelled';
      } else {
        return NextResponse.json({ error: 'Invalid operation' }, { status: 403 });
      }
    }

    await order.save();
    return NextResponse.json({ order, message: 'Order updated!' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
