'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageSelect: (imageData: { base64: string; mimeType: string; preview: string }) => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageSelect, disabled }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1];
        setPreview(result);
        onImageSelect({
          base64,
          mimeType: file.type,
          preview: result,
        });
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const clearImage = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!preview ? (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onDrop={disabled ? undefined : handleDrop}
            onDragOver={disabled ? undefined : handleDragOver}
            onDragLeave={disabled ? undefined : handleDragLeave}
            onClick={() => !disabled && document.getElementById('image-input')?.click()}
            role="button"
            tabIndex={0}
            aria-label="منطقة رفع الصورة"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.getElementById('image-input')?.click();
              }
            }}
          >
            <input
              id="image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={disabled}
              aria-label="اختيار صورة"
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">اسحب الصورة وأفلتها هنا</p>
            <p className="text-sm text-muted-foreground mb-4">أو اضغط لاختيار صورة من جهازك</p>
            <p className="text-xs text-muted-foreground">
              الصيغ المدعومة: JPG, PNG, GIF, WebP
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={preview}
                alt="الصورة المحملة"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 left-2"
              onClick={clearImage}
              disabled={disabled}
              aria-label="إزالة الصورة"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              <span>تم تحميل الصورة بنجاح</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ImageUploader;
