'use client';

import { useState, useCallback } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { DescriptionField } from '@/components/DescriptionField';
import { EditableField } from '@/components/EditableField';
import { APIStatusIndicator } from '@/components/APIStatusIndicator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Info } from 'lucide-react';
import type { ApiProvider, LoadingState } from '@/types';

export default function HomePage() {
  const [originalDescription, setOriginalDescription] = useState('');
  const [reformulatedDescription, setReformulatedDescription] = useState('');
  const [apiUsed, setApiUsed] = useState<ApiProvider | null>(null);

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
      setReformulatedDescription('');
      setApiUsed(null);

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
          setApiUsed(result.apiUsed);
          toast.success('تم وصف الصورة بنجاح');
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

  const handleReformulate = useCallback(async () => {
    if (!originalDescription) return;

    setLoading((prev) => ({ ...prev, isReformulating: true }));

    try {
      const response = await fetch('/api/reformulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalDescription }),
      });

      const result = await response.json();

      if (result.success) {
        setReformulatedDescription(result.reformulatedText);
        toast.success('تمت إعادة الصياغة بنجاح');
      } else {
        toast.error(result.error || 'فشل في إعادة الصياغة');
      }
    } catch (error) {
      console.error('Error reformulating:', error);
      toast.error('حدث خطأ أثناء إعادة الصياغة');
    } finally {
      setLoading((prev) => ({ ...prev, isReformulating: false }));
    }
  }, [originalDescription]);

  const handleSave = useCallback(
    async (editedText: string, wasEdited: boolean): Promise<boolean> => {
      setLoading((prev) => ({ ...prev, isSaving: true, isTraining: wasEdited }));

      try {
        if (wasEdited) {
          const response = await fetch('/api/train', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              original: reformulatedDescription || originalDescription,
              edited: editedText,
            }),
          });

          const result = await response.json();

          if (result.success) {
            toast.success('تم الحفظ والتدريب بنجاح', {
              description: `إجمالي التدريبات: ${result.newTrainingCount}`,
            });
            return true;
          } else {
            toast.error(result.error || 'فشل في التدريب');
            return false;
          }
        } else {
          toast.success('تم الحفظ بنجاح', {
            description: 'لم يتم تعديل النص، لذا لم يتم التدريب',
          });
          return true;
        }
      } catch (error) {
        console.error('Error saving:', error);
        toast.error('حدث خطأ أثناء الحفظ');
        return false;
      } finally {
        setLoading((prev) => ({ ...prev, isSaving: false, isTraining: false }));
      }
    },
    [originalDescription, reformulatedDescription]
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">وصف الصور للمكفوفين</h1>
        <p className="text-muted-foreground">
          ارفع صورة للحصول على وصف تفصيلي يتبع معايير WCAG 2.1
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>كيفية الاستخدام:</strong> ارفع صورة → اضغط &quot;إعادة الصياغة&quot; → عدّل الوصف إذا لزم الأمر → اضغط &quot;حفظ&quot; لتدريب النموذج
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">رفع الصورة</h2>
        <APIStatusIndicator currentApi={apiUsed} />
      </div>

      <ImageUploader
        onImageSelect={handleImageSelect}
        disabled={loading.isDescribing}
      />

      {(originalDescription || loading.isDescribing) && (
        <DescriptionField
          title="الوصف الأصلي من AI"
          description={originalDescription}
          apiUsed={apiUsed || undefined}
          showReformulateButton={true}
          onReformulate={handleReformulate}
          isLoading={loading.isDescribing || loading.isReformulating}
          placeholder="جاري وصف الصورة..."
        />
      )}

      {(reformulatedDescription || loading.isReformulating) && (
        <DescriptionField
          title="الوصف بعد إعادة الصياغة"
          description={reformulatedDescription}
          apiUsed="local"
          isLoading={loading.isReformulating}
          placeholder="جاري إعادة الصياغة..."
        />
      )}

      {reformulatedDescription && (
        <EditableField
          title="التعديل اليدوي"
          initialValue={reformulatedDescription}
          onSave={handleSave}
          isLoading={loading.isSaving}
          placeholder="يمكنك تعديل الوصف هنا..."
        />
      )}
    </div>
  );
}
