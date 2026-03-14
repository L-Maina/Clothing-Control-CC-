import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const handles = await db.socialHandle.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ handles });
  } catch (error) {
    console.error('Failed to fetch social handles:', error);
    return NextResponse.json({ handles: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, handle, url } = body;

    const socialHandle = await db.socialHandle.create({
      data: {
        platform,
        handle,
        url,
        isActive: true,
      },
    });

    return NextResponse.json(socialHandle);
  } catch (error) {
    console.error('Failed to create social handle:', error);
    return NextResponse.json({ error: 'Failed to create social handle' }, { status: 500 });
  }
}
