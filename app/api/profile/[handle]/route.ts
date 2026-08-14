import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const profile = store.getProfile(handle);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}
