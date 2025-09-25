'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useStorage } from '@/hooks/use-storage';
import { cn } from '@/lib/utils';
import { Loader2, Upload, X, ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

interface SingleImageUploadDialogProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  acceptedTypes?: string;
  maxSizeInMB?: number;
  handleUpload?: () => Promise<void>;
}

export const SingleImageUploadDialog: React.FC<SingleImageUploadDialogProps> = ({
  imageUrl = '',
  onImageChange,
  trigger,
  title = 'Tải ảnh lên',
  description = 'Chọn một ảnh để tải lên',
  acceptedTypes = 'image/*',
  maxSizeInMB = 5,
  handleUpload,
}) => {
  const { uploadFile } = useStorage();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setCurrentImageUrl(imageUrl);
    console.log('🖼️ ImageUrl prop changed:', imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    const handleUpload = async () => {
      if (file) {
        // Check file size
        if (file.size > maxSizeInMB * 1024 * 1024) {
          toast.error(`Kích thước file không được vượt quá ${maxSizeInMB}MB`);
          setFile(null);
          setPreviewUrl(null);
          return;
        }

        setIsUploading(true);
        try {
          const data = await uploadFile(file);
          if (data) {
            console.log('📸 Upload successful:', data.url);
            setCurrentImageUrl(data.url);
            onImageChange(data.url);
            toast.success('Ảnh đã được tải lên thành công!');
            setPreviewUrl(null);
            setFile(null);
          }
        } catch (error) {
          toast.error('Tải ảnh lên thất bại. Vui lòng thử lại.');
          console.error('Upload error:', error);
        } finally {
          setIsUploading(false);
        }
      }
    };
    handleUpload();
  }, [file, uploadFile, onImageChange, maxSizeInMB]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      // Create preview URL
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
      setFile(selectedFile);
    }
    // Reset input value
    e.target.value = '';
  };

  const handleDeleteImage = async () => {
    if (!currentImageUrl) return;
    setIsDeleting(true);
    try {
      setCurrentImageUrl('');
      onImageChange('');
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFile(null);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (currentImageUrl) {
      onImageChange(currentImageUrl);
    }
    handleUpload?.();
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <ImageIcon className="h-4 w-4 mr-2" />
            {currentImageUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area or Current Image */}
          <div className="flex flex-col items-center space-y-4">
            {displayImageUrl ? (
              <div className="relative group w-full max-w-sm aspect-square rounded-lg overflow-hidden border-2 border-muted">
                <Image
                  src={displayImageUrl || '/placeholder.svg'}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />

                {/* Delete Button Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                {currentImageUrl && !previewUrl && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={handleDeleteImage}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                )}

                {/* Preview indicator */}
                {previewUrl && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Xem trước
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => !isUploading && document.getElementById('single-upload')?.click()}
                className={cn(
                  'relative p-8 border-2 border-dashed rounded-lg w-full max-w-sm aspect-square cursor-pointer transition-all duration-200',
                  isUploading
                    ? 'border-primary/50 bg-primary/5 cursor-not-allowed'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5',
                )}
              >
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-12 w-12 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground text-center">
                        Đang tải ảnh lên...
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground font-medium">
                          Nhấn để chọn ảnh
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Tối đa {maxSizeInMB}MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* File Input */}
            <input
              id="single-upload"
              type="file"
              accept={acceptedTypes}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            {/* Upload Button for replacing image */}
            {displayImageUrl && !isUploading && (
              <Button
                variant="outline"
                onClick={() => document.getElementById('single-upload')?.click()}
                className="w-full max-w-sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                {currentImageUrl ? 'Thay đổi ảnh' : 'Chọn ảnh khác'}
              </Button>
            )}
          </div>

          {/* Upload Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Hỗ trợ: JPG, PNG, GIF. Tối đa {maxSizeInMB}MB
            </p>
            {file && (
              <p className="text-xs text-blue-600 mt-1">
                Đã chọn: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUploading}
            className="bg-rose-600 hover:bg-rose-700"
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xong
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
