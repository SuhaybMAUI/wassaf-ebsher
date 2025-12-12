'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  Key,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  Shield
} from 'lucide-react';
import type { ApiProvider } from '@/types';

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [primaryApi, setPrimaryApi] = useState<ApiProvider>('gemini');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [hasClaudeKey, setHasClaudeKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // جلب الإعدادات الحالية
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();

        if (data.success) {
          setHasGeminiKey(data.settings.hasGeminiKey);
          setHasClaudeKey(data.settings.hasClaudeKey);
          setPrimaryApi(data.settings.primaryApi);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiKey: geminiKey || undefined,
          claudeKey: claudeKey || undefined,
          primaryApi,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('تم حفظ الإعدادات بنجاح');
        // تحديث حالة المفاتيح
        if (geminiKey) setHasGeminiKey(true);
        if (claudeKey) setHasClaudeKey(true);
        // مسح الحقول بعد الحفظ
        setGeminiKey('');
        setClaudeKey('');
      } else {
        toast.error(data.error || 'فشل في حفظ الإعدادات');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  }, [geminiKey, claudeKey, primaryApi]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
        <p className="text-muted-foreground">
          إدارة مفاتيح API وإعدادات التطبيق
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          مفاتيح API الخاصة بك محمية ومشفرة. لن يتم عرضها بالكامل بعد الحفظ.
        </AlertDescription>
      </Alert>

      {/* Gemini API */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Gemini API
              </CardTitle>
              <CardDescription>
                مفتاح Google Gemini API للوصف الأساسي
              </CardDescription>
            </div>
            <Badge variant={hasGeminiKey ? 'default' : 'secondary'} className="gap-1">
              {hasGeminiKey ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  مُعد
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  غير مُعد
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-key">مفتاح API</Label>
            <div className="relative">
              <Input
                id="gemini-key"
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder={hasGeminiKey ? '***المفتاح محفوظ - أدخل مفتاحاً جديداً للتحديث' : 'أدخل مفتاح Gemini API'}
                className="pl-10"
                dir="ltr"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
              >
                {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            يمكنك الحصول على المفتاح من{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Claude API */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Claude API
              </CardTitle>
              <CardDescription>
                مفتاح Anthropic Claude API كبديل احتياطي
              </CardDescription>
            </div>
            <Badge variant={hasClaudeKey ? 'default' : 'secondary'} className="gap-1">
              {hasClaudeKey ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  مُعد
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  غير مُعد
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claude-key">مفتاح API</Label>
            <div className="relative">
              <Input
                id="claude-key"
                type={showClaudeKey ? 'text' : 'password'}
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder={hasClaudeKey ? '***المفتاح محفوظ - أدخل مفتاحاً جديداً للتحديث' : 'أدخل مفتاح Claude API'}
                className="pl-10"
                dir="ltr"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowClaudeKey(!showClaudeKey)}
              >
                {showClaudeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            يمكنك الحصول على المفتاح من{' '}
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Anthropic Console
            </a>
          </p>
        </CardContent>
      </Card>

      {/* ترتيب الأولوية */}
      <Card>
        <CardHeader>
          <CardTitle>ترتيب الأولوية</CardTitle>
          <CardDescription>
            اختر أي API يتم استخدامه أولاً
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={primaryApi === 'gemini' ? 'default' : 'outline'}
              onClick={() => setPrimaryApi('gemini')}
              className="flex-1"
            >
              Gemini أولاً
            </Button>
            <Button
              variant={primaryApi === 'claude' ? 'default' : 'outline'}
              onClick={() => setPrimaryApi('claude')}
              className="flex-1"
            >
              Claude أولاً
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            في حال فشل API الأساسي، سيتم استخدام البديل تلقائياً.
          </p>
        </CardContent>
      </Card>

      {/* تنبيه */}
      {!hasGeminiKey && !hasClaudeKey && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            يجب إعداد مفتاح API واحد على الأقل لاستخدام خدمة وصف الصور.
          </AlertDescription>
        </Alert>
      )}

      {/* زر الحفظ */}
      <Button
        onClick={handleSave}
        disabled={isSaving || (!geminiKey && !claudeKey && primaryApi === (hasGeminiKey ? 'gemini' : hasClaudeKey ? 'claude' : 'gemini'))}
        className="w-full gap-2"
        size="lg"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            حفظ الإعدادات
          </>
        )}
      </Button>
    </div>
  );
}
