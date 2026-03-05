import { useRef, useState, useCallback, type ChangeEvent, type DragEvent } from 'react';

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
    <div className="image-upload-container" role="region" aria-label="Image upload">
      <h3 id="upload-heading">Upload an Image</h3>

      {fileError && (
        <p className="error-message" role="alert">
          {fileError}
        </p>
      )}

      {!previewUrl ? (
        <div
          className={`upload-area${dragOver ? ' drag-over' : ''}`}
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
          <div className="upload-content">
            <div className="upload-icon" aria-hidden="true">📁</div>
            <p>Drag &amp; drop an image here</p>
            <p className="upload-subtext">or click to browse</p>
            <p className="file-types">Supports: JPG, PNG, GIF, WebP</p>
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
        <div className="image-preview">
          <img
            src={previewUrl}
            alt="Preview of selected file"
            className="preview-image"
          />
          <div className="preview-actions">
            <button
              onClick={() => onUpload(previewUrl)}
              className="upload-button primary"
            >
              Analyze This Image
            </button>
            <button
              onClick={() => setPreviewUrl(null)}
              className="upload-button secondary"
            >
              Choose Different Image
            </button>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button
          onClick={onCancel}
          className="upload-button cancel"
          aria-label="Cancel upload and return to options"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;