'use client';

import { getFileStackConfig } from '@/lib/utils';
import * as Filestack from 'filestack-js';
import { useCallback, useMemo } from 'react';

export const useFilestack = (onUploadDone?: (res?: Filestack.PickerResponse) => void) => {
  const apiKey = getFileStackConfig();
  if (!apiKey) {
    throw new Error('FileStack API key is not configured.');
  }

  const client = Filestack.init(apiKey);

  const options = useMemo((): Filestack.PickerOptions => {
    return {
      accept: ['image/*', 'video/*', 'application/pdf'],
      maxSize: 5 * 1024 * 1024, // 5MB
      fromSources: ['local_file_system'],
      onUploadDone: (res: Filestack.PickerResponse) => {
        console.log('Upload complete:', res);
        onUploadDone?.();
      },
    };
  }, [client, onUploadDone]);

  const openUpload = useCallback(async () => {
    return await client.picker(options).open();
  }, [client, options]);

  return { openUpload };
};
