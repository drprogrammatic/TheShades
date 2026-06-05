'use client';

import { useState, useRef } from 'react';

// Compress and resize image client-side to stay well within Vercel's 4.5MB limit
function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob || file),
        'image/jpeg',
        quality,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export default function ImageUploader({ value, onChange, placeholder = 'Drag and drop an image here or click to upload' }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setUploading(true);
    try {
      // Compress before uploading so we stay under Vercel's body size limit
      const compressed = file.type === 'image/gif' ? file : await compressImage(file);

      const formData = new FormData();
      formData.append('file', compressed, file.name.replace(/\.[^.]+$/, '.jpg'));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      let data = {};
      try { data = await res.json(); } catch (_) {}

      if (!res.ok) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error(err);
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragActive ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div style={{ color: 'var(--color-text-light)' }}>Compressing &amp; uploading...</div>
        ) : value ? (
          <div>
            <img
              src={value}
              alt="Preview"
              style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain', margin: '0 auto' }}
            />
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--color-text-light)' }}>Click or drag a new image to replace</div>
          </div>
        ) : (
          <div style={{ color: 'var(--color-text-light)' }}>
            <svg style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <div>{placeholder}</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste URL here..."
          style={{ flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}
        />
        {value && <button type="button" onClick={(e) => { e.stopPropagation(); onChange(''); }} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Clear</button>}
      </div>
    </div>
  );
}
