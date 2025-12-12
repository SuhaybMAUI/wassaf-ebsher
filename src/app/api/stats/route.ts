import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let stats = await prisma.trainingStats.findFirst();

    if (!stats) {
      stats = await prisma.trainingStats.create({
        data: {
          totalTrainings: 0,
          lastTrainedAt: null,
        },
      });
    }

    return NextResponse.json({
      totalTrainings: stats.totalTrainings,
      lastTrainedAt: stats.lastTrainedAt?.toISOString() || null,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { totalTrainings: 0, lastTrainedAt: null },
      { status: 200 }
    );
  }
}
