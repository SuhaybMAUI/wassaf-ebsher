import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateApiKey } from '@/lib/ai-client';

// جلب الإعدادات
export async function GET() {
  try {
    let settings = await prisma.apiSettings.findFirst();

    if (!settings) {
      settings = await prisma.apiSettings.create({
        data: {
          primaryApi: 'gemini',
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        geminiKey: settings.geminiKey ? '***' + settings.geminiKey.slice(-4) : '',
        claudeKey: settings.claudeKey ? '***' + settings.claudeKey.slice(-4) : '',
        primaryApi: settings.primaryApi,
        hasGeminiKey: !!settings.geminiKey,
        hasClaudeKey: !!settings.claudeKey,
      },
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإعدادات' },
      { status: 500 }
    );
  }
}

// تحديث الإعدادات
export async function POST(request: NextRequest) {
  try {
    const { geminiKey, claudeKey, primaryApi, validateKeys } = await request.json();

    // التحقق من صلاحية المفاتيح إذا طُلب ذلك
    if (validateKeys) {
      const validationResults: { gemini?: boolean; claude?: boolean } = {};

      if (geminiKey) {
        validationResults.gemini = await validateApiKey('gemini', geminiKey);
      }
      if (claudeKey) {
        validationResults.claude = await validateApiKey('claude', claudeKey);
      }

      return NextResponse.json({
        success: true,
        validation: validationResults,
      });
    }

    // تحديث أو إنشاء الإعدادات
    let settings = await prisma.apiSettings.findFirst();

    const updateData: {
      geminiKey?: string;
      claudeKey?: string;
      primaryApi?: string;
    } = {};

    if (geminiKey !== undefined) updateData.geminiKey = geminiKey || null;
    if (claudeKey !== undefined) updateData.claudeKey = claudeKey || null;
    if (primaryApi) updateData.primaryApi = primaryApi;

    if (!settings) {
      settings = await prisma.apiSettings.create({
        data: {
          geminiKey: geminiKey || null,
          claudeKey: claudeKey || null,
          primaryApi: primaryApi || 'gemini',
        },
      });
    } else {
      settings = await prisma.apiSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات بنجاح',
    });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حفظ الإعدادات' },
      { status: 500 }
    );
  }
}
