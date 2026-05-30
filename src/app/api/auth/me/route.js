import { NextResponse } from 'next/server';
import { getSessionUserFromCookies } from '@/lib/serverAuth';

export async function GET() {
  try {
    const user = await getSessionUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        company: user.company || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
