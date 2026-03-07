import { useRef, useState, useCallback, type ChangeEvent, type DragEvent } from 'react';
import styles from '../MITDataSciencePage.module.css';

interface ImageUploadProps {
  onUpload: (imageSrc: string) => void;
  onCancel: () => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ImageUpload = ({ onUpload, onCancel }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && ACCEPTED_TYPES.includes(file.type)) {
      setFileError(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFileError('Please select a valid image file (JPG, PNG, GIF, or WebP).');
    }
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
            <div className={styles.uploadIcon} aria-hidden="true">📁</div>
            <p>Drag &amp; drop an image here</p>
            <p className={styles.uploadSubtext}>or click to browse</p>
            <p className={styles.fileTypes}>Supports: JPG, PNG, GIF, WebP</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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