import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { WCAG_DESCRIPTION_PROMPT } from './wcag-prompt';

export type ApiProvider = 'gemini' | 'claude';

export interface DescriptionResult {
  description: string;
  apiUsed: ApiProvider;
  wasFallback: boolean;
  error?: string;
}

// وصف الصورة باستخدام Gemini API
async function describeWithGemini(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  // استخدام gemini-1.5-flash بدلاً من gemini-pro-vision المتوقف
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent([
    WCAG_DESCRIPTION_PROMPT,
    {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    },
  ]);

  const response = result.response;
  return response.text();
}

// وصف الصورة باستخدام Claude API
async function describeWithClaude(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<string> {
  const anthropic = new Anthropic({ apiKey });

  const mediaType = mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: WCAG_DESCRIPTION_PROMPT,
          },
        ],
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (textBlock && textBlock.type === 'text') {
    return textBlock.text;
  }
  throw new Error('No text response from Claude');
}

// وصف الصورة مع نظام Fallback
export async function getImageDescription(
  imageBase64: string,
  mimeType: string,
  geminiKey?: string,
  claudeKey?: string,
  primaryApi: ApiProvider = 'gemini'
): Promise<DescriptionResult> {
  const apis = primaryApi === 'gemini'
    ? [{ provider: 'gemini' as const, key: geminiKey }, { provider: 'claude' as const, key: claudeKey }]
    : [{ provider: 'claude' as const, key: claudeKey }, { provider: 'gemini' as const, key: geminiKey }];

  let attemptIndex = 0;
  for (const api of apis) {
    if (!api.key) {
      attemptIndex++;
      continue;
    }

    try {
      let description: string;

      if (api.provider === 'gemini') {
        description = await describeWithGemini(imageBase64, mimeType, api.key);
      } else {
        description = await describeWithClaude(imageBase64, mimeType, api.key);
      }

      // إذا كان attemptIndex > 0 فهذا يعني أنه تم استخدام المزود الاحتياطي
      const wasFallback = attemptIndex > 0;

      return {
        description,
        apiUsed: api.provider,
        wasFallback,
      };
    } catch (error) {
      console.error(`Error with ${api.provider}:`, error);
      attemptIndex++;
      continue;
    }
  }

  return {
    description: '',
    apiUsed: primaryApi,
    wasFallback: false,
    error: 'فشل الاتصال بجميع خدمات AI. يرجى التحقق من مفاتيح API.',
  };
}

// إعادة صياغة الوصف باستخدام النموذج المحلي
export async function reformulateDescription(
  originalDescription: string,
  mlServiceUrl: string
): Promise<string> {
  try {
    const response = await fetch(`${mlServiceUrl}/reformulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: originalDescription }),
    });

    if (!response.ok) {
      throw new Error('ML service error');
    }

    const data = await response.json();
    return data.reformulated_text;
  } catch (error) {
    console.error('Reformulation error:', error);
    // في حالة الفشل، نعيد النص الأصلي
    return originalDescription;
  }
}

// تدريب النموذج المحلي
export async function trainModel(
  originalText: string,
  editedText: string,
  mlServiceUrl: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${mlServiceUrl}/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original: originalText,
        edited: editedText,
      }),
    });

    if (!response.ok) {
      throw new Error('Training failed');
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'تم التدريب بنجاح',
    };
  } catch (error) {
    console.error('Training error:', error);
    return {
      success: false,
      message: 'فشل التدريب. يرجى المحاولة مرة أخرى.',
    };
  }
}

// التحقق من صلاحية مفتاح API
export async function validateApiKey(
  provider: ApiProvider,
  apiKey: string
): Promise<boolean> {
  try {
    if (provider === 'gemini') {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      await model.generateContent('test');
      return true;
    } else {
      const anthropic = new Anthropic({ apiKey });
      await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    }
  } catch {
    return false;
  }
}
