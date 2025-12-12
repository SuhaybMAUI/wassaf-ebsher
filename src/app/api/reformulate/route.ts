import { NextRequest, NextResponse } from 'next/server';
import { reformulateDescription } from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'النص مطلوب' },
        { status: 400 }
      );
    }

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    const reformulatedText = await reformulateDescription(text, mlServiceUrl);

    return NextResponse.json({
      success: true,
      reformulatedText,
    });
  } catch (error) {
    console.error('Reformulate API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إعادة الصياغة' },
      { status: 500 }
    );
  }
}
