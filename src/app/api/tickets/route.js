import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { getSessionUserFromCookies } from '@/lib/serverAuth';

export async function GET() {
  try {
    const user = await getSessionUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    // Admin sees all, otherwise user sees their own
    const query = user.role === 'admin' ? {} : { user: user._id };
    const tickets = await Ticket.find(query).populate('user', 'name company email').sort({ createdAt: -1 });
    
    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getSessionUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    const ticket = await Ticket.create({
      user: user._id,
      subject,
      message,
      status: 'Open'
    });

    return NextResponse.json({ ticket, message: 'Ticket submitted!' }, { status: 201 });
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
    const { id, status, adminResponse } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const update = {};
    if (status) update.status = status;
    if (adminResponse !== undefined) update.adminResponse = adminResponse;

    const ticket = await Ticket.findByIdAndUpdate(id, update, { new: true }).populate('user', 'name company email');
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ ticket, message: 'Ticket updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
