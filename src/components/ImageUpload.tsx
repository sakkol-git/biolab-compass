import { useState, useRef, useCallback } from "react";
import { ImagePlus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

/**
 * ImageUpload — file picker with drag-and-drop that creates a local
 * object-URL preview.  In a real app the file would be uploaded to a
 * server / S3 and the returned URL persisted; here we keep the blob URL
 * so the rest of the UI can display it immediately.
 */
const ImageUpload = ({ value, onChange, className, label = "Product Image" }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onChange(url);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const handleRemove = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium leading-none">{label}</p>

      {value ? (
        /* ── Preview ─────────────────────────────────────────── */
        <div className="relative group rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Product preview"
            className="w-full h-40 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        /* ── Drop zone ───────────────────────────────────────── */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-2 py-8 border border-dashed rounded-lg transition-colors cursor-pointer",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
          )}
        >
          <div className="p-2 bg-muted rounded-lg">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              <Upload className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
              Upload Image
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag & drop or click to browse — PNG, JPG up to 5 MB
            </p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
};

export default ImageUpload;
