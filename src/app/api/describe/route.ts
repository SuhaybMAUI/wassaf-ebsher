import { NextRequest, NextResponse } from 'next/server';
import { getImageDescription } from '@/lib/ai-client';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();

    if (!image || !mimeType) {
      return NextResponse.json(
        { success: false, error: 'الصورة مطلوبة' },
        { status: 400 }
      );
    }

    // جلب إعدادات API
    let geminiKey = process.env.GEMINI_API_KEY;
    let claudeKey = process.env.ANTHROPIC_API_KEY;
    let primaryApi: 'gemini' | 'claude' = 'gemini';

    try {
      const settings = await prisma.apiSettings.findFirst();
      if (settings) {
        if (settings.geminiKey) geminiKey = settings.geminiKey;
        if (settings.claudeKey) claudeKey = settings.claudeKey;
        primaryApi = settings.primaryApi as 'gemini' | 'claude';
      }
    } catch {
      // استخدام القيم الافتراضية من البيئة
    }

    if (!geminiKey && !claudeKey) {
      return NextResponse.json(
        { success: false, error: 'يرجى إعداد مفاتيح API في صفحة الإعدادات' },
        { status: 400 }
      );
    }

    const result = await getImageDescription(
      image,
      mimeType,
      geminiKey,
      claudeKey,
      primaryApi
    );

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      description: result.description,
      apiUsed: result.apiUsed,
    });
  } catch (error) {
    console.error('Describe API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء وصف الصورة' },
      { status: 500 }
    );
  }
}
