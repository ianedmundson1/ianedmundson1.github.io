import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onUpload: (imageSrc: string) => void;
  onCancel: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="image-upload-container">
      <h3>Upload an Image</h3>
      
      {!previewUrl ? (
        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <p>Drag & drop an image here</p>
            <p className="upload-subtext">or click to browse</p>
            <p className="file-types">Supports: JPG, PNG, GIF</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="image-preview">
          <img 
            src={previewUrl} 
            alt="Preview" 
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
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;