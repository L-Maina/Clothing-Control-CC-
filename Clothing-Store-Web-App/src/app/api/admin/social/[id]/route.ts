import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const socialHandle = await db.socialHandle.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(socialHandle);
  } catch (error) {
    console.error('Failed to update social handle:', error);
    return NextResponse.json({ error: 'Failed to update social handle' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await db.socialHandle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete social handle:', error);
    return NextResponse.json({ error: 'Failed to delete social handle' }, { status: 500 });
  }
}
