import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';
    const timeframe = searchParams.get('timeframe') || 'global';
    const search = searchParams.get('search') || '';
    const userHandle = searchParams.get('userHandle') || '';

    const data = store.getLeaderboardData({
      category,
      timeframe,
      search,
      userHandle,
    });

    return NextResponse.json({
      success: true,
      category,
      timeframe,
      search,
      totalEntries: data.entries.length,
      entries: data.entries,
      meta: data.meta,
      userPosition: data.userPosition,
      neighborhood: data.neighborhood,
    });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve leaderboard' }, { status: 500 });
  }
}

