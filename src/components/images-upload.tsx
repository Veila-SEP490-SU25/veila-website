'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Image } from '@/components/image';
import { toast } from 'sonner';
import { useFilestack } from '@/hooks/use-filestack';
import { PickerResponse } from 'filestack-js';

interface ImagesUploadProps {
  imageUrls: string;
  setImageUrls: (urls: string) => void;
}

export const ImagesUpload: React.FC<ImagesUploadProps> = ({ imageUrls, setImageUrls }) => {
  const [images, setImages] = useState<string[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // hook with callback that updates state when upload completes
  const { openUpload } = useFilestack((res?: PickerResponse) => {
    toast.success('Ảnh đã được tải lên thành công!');
    if (res?.filesUploaded?.length) {
      if (res?.filesUploaded?.length) {
        const uploadedUrls = res.filesUploaded.map((f) => f.url);
        const existing = imageUrls ? imageUrls.split(',').filter(Boolean) : [];
        const newImages = [...existing, ...uploadedUrls];
        setImageUrls(newImages.join(','));
        toast.success(`Đã tải lên ${res.filesUploaded.length} ảnh`);
      }
    }
  });

  useEffect(() => {
    if (imageUrls) {
      const parsedImages = imageUrls.split(',').filter((url) => url.trim());
      setImages(parsedImages);
    } else {
      setImages([]);
    }
  }, [imageUrls]);

  const handleUpload = async () => {
    try {
      await openUpload();
    } catch (e) {
      toast.error('Tải ảnh lên thất bại. Vui lòng thử lại.');
    }
  };

  const handleDeleteImage = async (url: string, index: number) => {
    setUploadingIndex(index);
    try {
      const imgUrls = images.filter((img) => img !== url).join(',');
      setImageUrls(imgUrls);
      toast.success('Ảnh đã được xóa thành công!');
    } catch {
      toast.error('Xóa ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Upload Area */}
        <div
          onClick={handleUpload}
          className={cn(
            'relative p-6 border-2 border-dashed rounded-lg aspect-square cursor-pointer transition-all duration-200',
            'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5',
          )}
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center font-medium">Tải ảnh lên</p>
            <p className="text-xs text-muted-foreground/70 text-center">Nhấn để chọn ảnh</p>
          </div>
        </div>

        {images.map((url, index) => (
          <div
            key={index}
            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-muted"
          >
            <Image
              alt={`Upload ${index + 1}`}
              src={url || '/placeholder.svg'}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

            <Button
              variant="destructive"
              size="icon"
              className={cn(
                'absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                uploadingIndex === index && 'opacity-100',
              )}
              onClick={() => handleDeleteImage(url, index)}
              disabled={uploadingIndex === index}
            >
              {uploadingIndex === index ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Info */}
      <div className="text-sm text-muted-foreground">
        {images.length === 0 ? (
          <p>Chưa có ảnh nào được tải lên. Nhấn vào khu vực tải lên để bắt đầu.</p>
        ) : (
          <p>Đã tải lên {images.length} ảnh. Di chuột qua ảnh để xóa chúng.</p>
        )}
      </div>
    </div>
  );
};
