import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  onUploaded: (url: string) => void;
  compact?: boolean;
}

export default function ImageUpload({ onUploaded, compact }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Preview
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          onUploaded(data.url);
          setPreview(null);
        } else {
          alert(data.error || '上传失败');
        }
      } catch {
        alert('上传出错，请重试');
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [onUploaded]
  );

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-3 py-1.5 border border-[#DB380F]/40 text-[#DB380F] text-xs tracking-wider hover:bg-[#DB380F] hover:text-white transition-colors disabled:opacity-50"
        style={{ fontFamily: 'Anton, Impact, sans-serif' }}
      >
        {uploading ? 'UPLOADING...' : compact ? '+ IMG' : '+ UPLOAD IMAGE'}
      </button>

      {uploading && preview && (
        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
          <img src={preview} alt="" className="w-full h-full object-cover animate-pulse" />
        </div>
      )}

      {uploading && (
        <div className="w-4 h-4 border-2 border-[#DB380F] border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
