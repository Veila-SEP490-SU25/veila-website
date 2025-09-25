'use client';

import { Button } from '@/components/ui/button';
import { useStorage } from '@/hooks/use-storage';
import { cn } from '@/lib/utils';
import { Loader2, Upload } from 'lucide-react';
import { ChangeEvent, ReactNode, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UploadButtonProps {
  urls: string;
  setUrls: (urls: string) => void;
  trigger?: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const UploadButton = ({
  urls,
  setUrls,
  trigger,
  className,
  variant = 'default',
  size = 'default',
}: UploadButtonProps) => {
  const { uploadFile, isUploading } = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const { url } = (await uploadFile(file)) || {};
        if (url) {
          setUrls(url);
          toast.success('Tải file lên thành công');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Đã có lỗi xảy ra khi tải file lên. Vui lòng thử lại.');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [fileInputRef, uploadFile, setUrls],
  );

  const getButtonContent = () => {
    if (isUploading) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Đang tải lên...
        </>
      );
    }

    return (
      <>
        <Upload className="h-4 w-4 mr-2" />
        Tải lên file
      </>
    );
  };

  if (trigger) {
    return (
      <>
        <div onClick={handleButtonClick} className="cursor-pointer">
          {trigger}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple={false}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={isUploading}
        onClick={handleButtonClick}
        className={cn('transition-all duration-200', className)}
      >
        {getButtonContent()}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple={false}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </>
  );
};
