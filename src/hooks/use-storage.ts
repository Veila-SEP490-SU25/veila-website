"use client";

import { useFirebase } from "@/services/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useState } from "react";

interface FileData {
  url: string;
  path: string;
}

export const useStorage = () => {
  const { storage } = useFirebase();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Upload file
  const uploadFile = useCallback(
    (file: File, path = "uploads", replacePath?: string) => {
      if (!storage || !file) return;

      return new Promise<FileData>((resolve, reject) => {
        setIsUploading(true);
        setUploadError(null);
        setUploadProgress(0);

        // If replacing an existing file
        if (replacePath) {
          deleteObject(ref(storage, replacePath)).catch((err) => {
            console.warn("Could not delete old file:", err);
          });
        }

        const storagePath = `${path}/${file.name}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            setUploadError(error);
            setIsUploading(false);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            const data = { url, path: storagePath };
            setFileData(data);
            setIsUploading(false);
            resolve(data);
          }
        );
      });
    },
    [storage]
  );

  // Delete file
  const deleteFile = useCallback(
    async (filePath: string) => {
      if (!storage || !filePath) return false;
      try {
        await deleteObject(ref(storage, filePath));
        setFileData(null);
        return true;
      } catch (error) {
        setUploadError(error as Error);
        return false;
      }
    },
    [storage]
  );

  return {
    uploadFile,
    deleteFile,
    uploadProgress,
    uploadError,
    fileData,
    isUploading,
  };
};
