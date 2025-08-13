import { Button } from "@/components/ui/button";
import { useStorage } from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ImagesUploadProps {
  imageUrls: string;
  setImageUrls: (urls: string) => void;
}

export const ImagesUpload: React.FC<ImagesUploadProps> = ({
  imageUrls,
  setImageUrls,
}) => {
  const { uploadFile, deleteFile } = useStorage();

  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (imageUrls) {
      const parsedImages = imageUrls.split(",").filter((url) => url.trim());
      setImages(parsedImages);
      console.log("Parsed image URLs:", parsedImages);
    } else {
      setImages([]);
      console.log("Cleared image URLs");
    }
  }, [imageUrls]);

  useEffect(() => {
    const handleUpload = async () => {
      if (file) {
        setIsUploading(true);
        try {
          const data = await uploadFile(file, "shop-licenses");
          if (data) {
            const imgUrls = imageUrls ? `${imageUrls},${data.url}` : data.url;
            setImageUrls(imgUrls);
            toast.success("Ảnh đã được tải lên thành công!");
          }
        } catch (error) {
          toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
        } finally {
          setIsUploading(false);
          setFile(null);
        }
      }
    };
    handleUpload();
  }, [file, uploadFile, imageUrls, setImageUrls]);

  const handleDeleteImage = async (url: string, index: number) => {
    setUploadingIndex(index);
    try {
      await deleteFile(url);
      const imgUrls = images.filter((img) => img !== url).join(",");
      setImageUrls(imgUrls);
      toast.success("Ảnh đã được xóa thành công!");
    } catch (error) {
      toast.error("Xóa ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Upload Area */}
        <div
          onClick={() =>
            !isUploading && document.getElementById("upload")?.click()
          }
          className={cn(
            "relative p-6 border-2 border-dashed rounded-lg aspect-square cursor-pointer transition-all duration-200",
            isUploading
              ? "border-primary/50 bg-primary/5 cursor-not-allowed"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground text-center">
                  Đang tải ảnh lên...
                </p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center font-medium">
                  Tải ảnh lên
                </p>
                <p className="text-xs text-muted-foreground/70 text-center">
                  Nhấn để chọn ảnh
                </p>
              </>
            )}
          </div>
          <input
            id="upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setFile(selectedFile);
              // Reset the input value to allow re-uploading the same file
              e.target.value = "";
            }}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* Image Grid */}
        {images.map((url, index) => (
          <div
            key={index}
            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-muted"
          >
            <img
              alt={`Upload ${index + 1}`}
              src={url || "/placeholder.svg"}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />

            {/* Delete Button Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

            <Button
              variant="destructive"
              size="icon"
              className={cn(
                "absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                uploadingIndex === index && "opacity-100"
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
          <p>
            Chưa có ảnh nào được tải lên. Nhấn vào khu vực tải lên để bắt đầu.
          </p>
        ) : (
          <p>Đã tải lên {images.length} ảnh. Di chuột qua ảnh để xóa chúng.</p>
        )}
      </div>
    </div>
  );
};
