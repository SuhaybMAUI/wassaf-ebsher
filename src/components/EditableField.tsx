'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, RotateCcw, Loader2, Edit3, Copy, Check, CheckCircle2, Info } from 'lucide-react';
import { useState, useCallback } from 'react';

interface EditableFieldInnerProps {
  title: string;
  initialValue: string;
  onSave: (value: string, wasEdited: boolean) => Promise<boolean>;
  isLoading?: boolean;
  placeholder?: string;
}

function EditableFieldInner({
  title,
  initialValue,
  onSave,
  isLoading = false,
  placeholder = 'يمكنك التعديل هنا...',
}: EditableFieldInnerProps) {
  const [value, setValue] = useState(initialValue);
  const [isSaved, setIsSaved] = useState(false);
  const [wasTrained, setWasTrained] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasChanges = value !== initialValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      // إذا تم التعديل بعد الحفظ، إعادة تعيين حالة الحفظ
      if (isSaved) {
        setIsSaved(false);
      }
    },
    [isSaved]
  );

  const handleSave = useCallback(async () => {
    const success = await onSave(value, hasChanges);
    if (success) {
      setIsSaved(true);
      setWasTrained(hasChanges);
    }
  }, [value, hasChanges, onSave]);

  const handleReset = useCallback(() => {
    setValue(initialValue);
    setIsSaved(false);
    setWasTrained(false);
  }, [initialValue]);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [value]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            {isSaved ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {isSaved && (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                تم الحفظ
              </Badge>
            )}
            {!isSaved && hasChanges && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                تم التعديل
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="min-h-[150px] resize-y"
            dir="rtl"
            disabled={isLoading || !initialValue}
            aria-label={title}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="mr-2 text-sm">جاري الحفظ...</span>
            </div>
          )}
        </div>

        {/* رسالة حالة التدريب بعد الحفظ */}
        {isSaved && (
          <Alert variant={wasTrained ? 'default' : 'default'} className={wasTrained ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'}>
            {wasTrained ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Info className="h-4 w-4 text-blue-500" />
            )}
            <AlertDescription className={wasTrained ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'}>
              {wasTrained
                ? 'تم حفظ الوصف وتدريب النموذج على التعديلات بنجاح.'
                : 'تم حفظ الوصف بدون تدريب (لم يتم إجراء تعديلات).'}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          {isSaved ? (
            // بعد الحفظ: إظهار زر النسخ
            <Button
              onClick={handleCopy}
              disabled={!value}
              className="gap-2"
              variant="default"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  نسخ للحافظة
                </>
              )}
            </Button>
          ) : (
            // قبل الحفظ: إظهار زر الحفظ
            <Button
              onClick={handleSave}
              disabled={!value || isLoading}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ
              {hasChanges && ' وتدريب'}
            </Button>
          )}

          {/* زر إعادة التعيين */}
          {(hasChanges || isSaved) && (
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={isLoading}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {isSaved ? 'تعديل جديد' : 'إلغاء التعديلات'}
            </Button>
          )}
        </div>

        {!isSaved && hasChanges && (
          <p className="text-sm text-muted-foreground">
            عند الحفظ، سيتم تدريب النموذج على هذا التعديل لتحسين جودة إعادة الصياغة.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// استخدام key لإعادة تعيين المكون عند تغيير initialValue
interface EditableFieldProps {
  title: string;
  initialValue: string;
  onSave: (value: string, wasEdited: boolean) => Promise<boolean>;
  isLoading?: boolean;
  placeholder?: string;
}

export function EditableField(props: EditableFieldProps) {
  return <EditableFieldInner key={props.initialValue} {...props} />;
}

export default EditableField;
