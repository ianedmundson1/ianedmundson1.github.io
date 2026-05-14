import { useRef, useState, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  onUpload: (imageSrc: string) => void;
  onCancel: () => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Defense in depth: the browser-supplied File.type is just a guess from the
// extension. Read the first 12 bytes and confirm the magic bytes match the
// declared MIME, so a renamed-extension SVG (or other payload) is rejected
// before it reaches the backend.
const readFirstBytes = (file: File, n: number): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buf = reader.result as ArrayBuffer;
      resolve(new Uint8Array(buf, 0, Math.min(n, buf.byteLength)));
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsArrayBuffer(file.slice(0, n));
  });

const sniffImageMagic = async (file: File): Promise<boolean> => {
  const head = await readFirstBytes(file, 12);
  if (head.length < 12) return false;
  const isPng =
    head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47 &&
    head[4] === 0x0d && head[5] === 0x0a && head[6] === 0x1a && head[7] === 0x0a;
  const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const isWebp =
    head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 &&
    head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50;
  if (file.type === 'image/png') return isPng;
  if (file.type === 'image/jpeg') return isJpeg;
  if (file.type === 'image/webp') return isWebp;
  return false;
};

const ImageUpload = ({ onUpload, onCancel }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file || !ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    const magicMatches = await sniffImageMagic(file);
    if (!magicMatches) {
      setFileError("That file's contents don't match its extension. Please choose a real JPG, PNG, or WebP image.");
      return;
    }
    setFileError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFileSelect(files[0]);
    },
    [handleFileSelect],
  );

  return (
    <div className={styles.imageUploadContainer} role="region" aria-label="Image upload">
      <h3 id="upload-heading">Upload an Image</h3>

      {fileError && (
        <p className={styles.errorMessage} role="alert">
          {fileError}
        </p>
      )}

      {!previewUrl ? (
        <div
          className={`${styles.uploadArea}${dragOver ? ` ${styles.dragOver}` : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-labelledby="upload-heading"
        >
          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon} aria-hidden="true"><Upload size={32} /></div>
            <p>Drag &amp; drop an image here</p>
            <p className={styles.uploadSubtext}>or click to browse</p>
            <p className={styles.fileTypes}>Supports: JPG, PNG, WebP</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Choose image file"
          />
        </div>
      ) : (
        <div className={styles.imagePreview}>
          <img
            src={previewUrl}
            alt="Preview of selected file"
            className={styles.previewImage}
          />
          <div className={styles.previewActions}>
            <button
              onClick={() => onUpload(previewUrl)}
              className={`${styles.uploadButton} ${styles.primary}`}
            >
              Analyze This Image
            </button>
            <button
              onClick={() => setPreviewUrl(null)}
              className={`${styles.uploadButton} ${styles.secondary}`}
            >
              Choose Different Image
            </button>
          </div>
        </div>
      )}

      <div className={styles.actionButtons}>
        <button
          onClick={onCancel}
          className={`${styles.uploadButton} ${styles.cancel}`}
          aria-label="Cancel upload and return to options"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;