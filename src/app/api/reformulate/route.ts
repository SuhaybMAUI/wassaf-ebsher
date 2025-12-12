import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(`${mlServiceUrl}/reformulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();

    return NextResponse.json({
      success: result.success,
      reformulatedText: result.reformulated_text,
      wasReformulated: result.was_reformulated,
      message: result.message,
    });
  } catch (error) {
    console.error('Reformulate API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إعادة الصياغة' },
      { status: 500 }
    );
  }
}
