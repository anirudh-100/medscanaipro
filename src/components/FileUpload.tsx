import { forwardRef, useCallback, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Image, X, FileImage, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onImageLoad: (image: HTMLImageElement) => void;
  isModelReady: boolean;
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  ({ onImageLoad, isModelReady }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(
      (file: File) => {
        setError(null);
        
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError("Please upload an image file (JPG, PNG, WEBP)");
          return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError("File size must be less than 10MB");
          return;
        }

        setIsProcessing(true);
        setFileName(file.name);
        
        // Clean up previous preview
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
          setIsProcessing(false);
          onImageLoad(img);
        };
        
        img.onerror = () => {
          setIsProcessing(false);
          setError("Failed to load image. Please try a different file.");
          setPreviewUrl(null);
          setFileName(null);
        };
        
        img.src = url;
      },
      [onImageLoad, previewUrl]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
      },
      [processFile]
    );

    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
      },
      [processFile]
    );

    const handleClick = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const clearImage = useCallback(() => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setFileName(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, [previewUrl]);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="medical-card p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileImage className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Upload Image</h3>
        </div>

        {!previewUrl ? (
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
            } ${!isModelReady ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              disabled={!isModelReady}
              className="hidden"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                  isDragging ? "bg-primary/20" : "bg-secondary"
                }`}
              >
                <Upload
                  className={`h-6 w-6 transition-colors ${
                    isDragging ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports JPG, PNG, WEBP (max 10MB)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
            {isProcessing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 border-2 border-muted border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Processing image...</p>
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-contain"
              />
            )}
            <Button
              onClick={clearImage}
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
            {fileName && !isProcessing && (
              <div className="absolute bottom-2 left-2 right-2 glass-subtle rounded-lg px-3 py-2 flex items-center gap-2">
                <Image className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs text-foreground truncate">{fileName}</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </motion.div>
    );
  }
);

FileUpload.displayName = "FileUpload";
