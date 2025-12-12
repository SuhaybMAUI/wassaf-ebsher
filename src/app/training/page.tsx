'use client';

import { useState, useCallback } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { DescriptionField } from '@/components/DescriptionField';
import { TrainingCounter } from '@/components/TrainingCounter';
import { APIStatusIndicator } from '@/components/APIStatusIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Brain, Loader2, Info } from 'lucide-react';
import type { ApiProvider, LoadingState } from '@/types';

export default function TrainingPage() {
  const [originalDescription, setOriginalDescription] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [apiUsed, setApiUsed] = useState<ApiProvider | null>(null);
  const [wasFallback, setWasFallback] = useState(false);

  const [loading, setLoading] = useState<LoadingState>({
    isUploading: false,
    isDescribing: false,
    isReformulating: false,
    isSaving: false,
    isTraining: false,
  });

  const handleImageSelect = useCallback(
    async (data: { base64: string; mimeType: string; preview: string }) => {
      setOriginalDescription('');
      setEditedDescription('');
      setApiUsed(null);
      setWasFallback(false);

      setLoading((prev) => ({ ...prev, isDescribing: true }));

      try {
        const response = await fetch('/api/describe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: data.base64,
            mimeType: data.mimeType,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setOriginalDescription(result.description);
          setEditedDescription(result.description);
          setApiUsed(result.apiUsed);
          setWasFallback(result.wasFallback || false);
          if (result.wasFallback) {
            toast.success('تم وصف الصورة بنجاح', {
              description: 'تم استخدام المزود الاحتياطي بسبب فشل المزود الأساسي',
            });
          } else {
            toast.success('تم وصف الصورة بنجاح');
          }
        } else {
          toast.error(result.error || 'فشل في وصف الصورة');
        }
      } catch (error) {
        console.error('Error describing image:', error);
        toast.error('حدث خطأ أثناء وصف الصورة');
      } finally {
        setLoading((prev) => ({ ...prev, isDescribing: false }));
      }
    },
    []
  );

  const handleTrain = useCallback(async () => {
    if (!originalDescription || !editedDescription) {
      toast.error('يجب وصف الصورة أولاً');
      return;
    }

    if (originalDescription === editedDescription) {
      toast.warning('لم يتم تعديل الوصف. يرجى إجراء تعديلات قبل التدريب.');
      return;
    }

    setLoading((prev) => ({ ...prev, isTraining: true }));

    try {
      const response = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original: originalDescription,
          edited: editedDescription,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('تم التدريب بنجاح!', {
          description: `إجمالي التدريبات: ${result.newTrainingCount}`,
        });
        // إرسال حدث لتحديث العداد فوراً
        window.dispatchEvent(new CustomEvent('training-complete'));
        // إعادة تعيين الحقول
        setOriginalDescription('');
        setEditedDescription('');
      } else {
        toast.error(result.error || 'فشل في التدريب');
      }
    } catch (error) {
      console.error('Error training:', error);
      toast.error('حدث خطأ أثناء التدريب');
    } finally {
      setLoading((prev) => ({ ...prev, isTraining: false }));
    }
  }, [originalDescription, editedDescription]);

  const hasChanges = originalDescription !== editedDescription && editedDescription.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">تدريب النموذج اللغوي</h1>
        <p className="text-muted-foreground">
          ساهم في تحسين جودة إعادة الصياغة من خلال تدريب النموذج
        </p>
      </div>

      <TrainingCounter />

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>كيفية التدريب:</strong> ارفع صورة → عدّل الوصف في الحقل الثاني ليصبح أفضل → اضغط &quot;تدريب النموذج&quot;
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">رفع الصورة</h2>
        <APIStatusIndicator currentApi={apiUsed} wasFallback={wasFallback} />
      </div>

      <ImageUploader
        onImageSelect={handleImageSelect}
        disabled={loading.isDescribing || loading.isTraining}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* الوصف الأصلي */}
        <DescriptionField
          title="الوصف الأصلي من AI"
          description={originalDescription}
          apiUsed={apiUsed || undefined}
          isLoading={loading.isDescribing}
          placeholder="جاري وصف الصورة..."
        />

        {/* الوصف المعدل */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">الوصف المعدل للتدريب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="قم بتعديل الوصف هنا ليصبح أفضل..."
              className="min-h-[150px] resize-y"
              dir="rtl"
              disabled={!originalDescription || loading.isTraining}
              aria-label="الوصف المعدل للتدريب"
            />
            {hasChanges && (
              <p className="text-sm text-green-600">
                تم اكتشاف تعديلات - يمكنك الآن تدريب النموذج
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* زر التدريب */}
      <div className="flex justify-center">
        <Button
          onClick={handleTrain}
          disabled={!hasChanges || loading.isTraining}
          size="lg"
          className="gap-2 px-8"
        >
          {loading.isTraining ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري التدريب...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              تدريب النموذج
            </>
          )}
        </Button>
      </div>

      {/* نصائح */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">نصائح لتدريب أفضل</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>تأكد من أن الوصف المعدل أكثر وضوحاً ودقة من الأصلي</li>
            <li>حافظ على جميع المعلومات المهمة عند التعديل</li>
            <li>استخدم لغة عربية فصحى سهلة الفهم</li>
            <li>رتب المعلومات من الأهم للأقل أهمية</li>
            <li>تجنب الإطالة غير الضرورية</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
