import { NextRequest, NextResponse } from 'next/server';
import { trainModel } from '@/lib/ai-client';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { original, edited, descriptionId } = await request.json();

    if (!original || !edited) {
      return NextResponse.json(
        { success: false, error: 'النص الأصلي والمعدل مطلوبان' },
        { status: 400 }
      );
    }

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    // تدريب النموذج
    const trainResult = await trainModel(original, edited, mlServiceUrl);

    if (!trainResult.success) {
      return NextResponse.json(
        { success: false, error: trainResult.message },
        { status: 500 }
      );
    }

    // تحديث إحصائيات التدريب
    let stats = await prisma.trainingStats.findFirst();

    if (!stats) {
      stats = await prisma.trainingStats.create({
        data: {
          totalTrainings: 1,
          lastTrainedAt: new Date(),
        },
      });
    } else {
      stats = await prisma.trainingStats.update({
        where: { id: stats.id },
        data: {
          totalTrainings: { increment: 1 },
          lastTrainedAt: new Date(),
        },
      });
    }

    // تحديث سجل الوصف إذا تم توفير المعرف
    if (descriptionId) {
      await prisma.description.update({
        where: { id: descriptionId },
        data: {
          usedForTraining: true,
          wasEdited: true,
          manualEdit: edited,
        },
      });

      // إضافة سجل التعديل
      await prisma.editLog.create({
        data: {
          descriptionId,
          beforeText: original,
          afterText: edited,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: trainResult.message,
      newTrainingCount: stats.totalTrainings,
    });
  } catch (error) {
    console.error('Train API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التدريب' },
      { status: 500 }
    );
  }
}
