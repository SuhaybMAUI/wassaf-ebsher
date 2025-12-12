'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Copy, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ApiProvider } from '@/types';

interface DescriptionFieldProps {
  title: string;
  description: string;
  apiUsed?: ApiProvider;
  showReformulateButton?: boolean;
  onReformulate?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function DescriptionField({
  title,
  description,
  apiUsed,
  showReformulateButton = false,
  onReformulate,
  isLoading = false,
  placeholder = 'سيظهر الوصف هنا...',
}: DescriptionFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!description) return;
    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {apiUsed && (
              <Badge
                variant={apiUsed === 'gemini' ? 'default' : apiUsed === 'local' ? 'outline' : 'secondary'}
                className={apiUsed === 'local' ? 'border-primary text-primary' : ''}
              >
                {apiUsed === 'gemini' ? 'Gemini' : apiUsed === 'claude' ? 'Claude' : 'النموذج المحلي'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={description}
            readOnly
            placeholder={placeholder}
            className="min-h-[150px] resize-none bg-muted/50"
            dir="rtl"
            aria-label={title}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="mr-2 text-sm">جاري المعالجة...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showReformulateButton && onReformulate && (
            <Button
              onClick={onReformulate}
              disabled={!description || isLoading}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة الصياغة
            </Button>
          )}
          <Button
            onClick={handleCopy}
            disabled={!description}
            variant="ghost"
            size="icon"
            aria-label="نسخ الوصف"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DescriptionField;
