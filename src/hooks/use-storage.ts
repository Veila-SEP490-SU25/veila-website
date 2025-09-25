'use client';

import { isSuccess } from '@/lib/utils';
import { useUploadFileMutation } from '@/services/apis';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useStorage = () => {
  const [uploadTrigger, { isLoading: isUploading }] = useUploadFileMutation();

  // Upload file
  const uploadFile = useCallback(
    async (file: File) => {
      if (!file) return;
      //check file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      const { statusCode, item } = await uploadTrigger(formData).unwrap();
      if (isSuccess(statusCode)) {
        return { url: item };
      }
    },
    [uploadTrigger],
  );

  return {
    uploadFile,
    isUploading,
  };
};
