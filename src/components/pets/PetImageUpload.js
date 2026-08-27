'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './PetImageUpload.module.css';

/**
 * Pet Image Upload Component
 * Handles image upload with preview, validation, and Cloudinary integration
 */
export function PetImageUpload({ images = [], onImagesChange, maxImages = 5 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Formato não suportado. Use JPG, PNG ou WebP.');
    }
    if (file.size > maxFileSize) {
      throw new Error('Arquivo muito grande. Máximo 5MB.');
    }
    if (images.length >= maxImages) {
      throw new Error(`Máximo ${maxImages} imagens permitidas.`);
    }
  };

  const uploadFile = async (file) => {
    validateFile(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'petadopt_unsigned');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao fazer upload. Tente novamente.');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFiles = async (files) => {
    setError(null);
    setUploading(true);

    try {
      const fileArray = Array.from(files);
      const uploadedUrls = [];

      for (const file of fileArray) {
        if (images.length + uploadedUrls.length >= maxImages) {
          setError(`Máximo de ${maxImages} imagens atingido.`);
          break;
        }

        try {
          const url = await uploadFile(file);
          uploadedUrls.push(url);
        } catch (err) {
          setError(err.message);
          break;
        }
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
      }
    } finally {
      setUploading(false);
      setDragActive(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      {/* Preview das Imagens */}
      {images.length > 0 && (
        <div className={styles.previewGrid}>
          {images.map((image, index) => (
            <div key={index} className={styles.previewItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={image}
                  alt={`Pet image ${index + 1}`}
                  fill
                  className={styles.image}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className={styles.removeButton}
                title="Remover imagem"
                disabled={uploading}
              >
                ✕
              </button>
              {index === 0 && (
                <div className={styles.badge}>Principal</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Área de Upload */}
      {images.length < maxImages && (
        <div
          className={`${styles.uploadArea} ${dragActive ? styles.active : ''} ${uploading ? styles.disabled : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={handleChange}
            disabled={uploading}
            className={styles.fileInput}
          />

          <div className={styles.uploadContent}>
            <svg
              className={styles.uploadIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <div className={styles.uploadText}>
              <h3 className={styles.uploadTitle}>
                {uploading ? 'Enviando...' : 'Arraste fotos aqui'}
              </h3>
              <p className={styles.uploadDescription}>
                ou{' '}
                <button
                  type="button"
                  onClick={openFileDialog}
                  className={styles.browseButton}
                  disabled={uploading}
                >
                  clique para selecionar
                </button>
              </p>
              <p className={styles.uploadInfo}>
                Máximo {maxImages} imagens • Até 5MB cada • JPG, PNG, WebP
              </p>
            </div>

            {uploading && <div className={styles.spinner} />}
          </div>
        </div>
      )}

      {/* Mensagens de Status */}
      {error && (
        <div className={styles.errorMessage}>
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Contador de Imagens */}
      {images.length > 0 && (
        <div className={styles.counter}>
          {images.length} de {maxImages} imagens
        </div>
      )}
    </div>
  );
}
