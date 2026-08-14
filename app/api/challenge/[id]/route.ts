import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const challenge = store.getChallenge(id);

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error('Challenge fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve challenge' }, { status: 500 });
  }
}
