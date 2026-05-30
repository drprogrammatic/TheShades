'use client';

import { useState, useRef } from 'react';

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
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
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
          <div style={{ color: 'var(--color-text-light)' }}>Uploading...</div>
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
