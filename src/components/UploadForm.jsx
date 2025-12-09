import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadForm({ setDocs, userId, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setError(null);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', userId);

      // POST to backend
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { docId } = res.data;
      const newDoc = { 
        id: docId, 
        name: selectedFile.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // ✅ FIX: Ensure currentDocs is always an array
      setDocs((currentDocs) => {
        // Handle if currentDocs is null, undefined, or not an array
        if (!Array.isArray(currentDocs)) {
          console.warn('currentDocs is not an array:', currentDocs);
          return [newDoc];
        }
        // Safe to spread now
        return [newDoc, ...currentDocs];
      });

      setIsLoading(false);
      setSelectedFile(null);
      
      if (onClose) onClose();

      // Navigate to /interact with new doc details
      navigate('/interact', { 
        state: { 
          docId: newDoc.id, 
          docName: newDoc.name 
        } 
      });
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
    if (onClose) onClose();
  };

  return (
    <div className="document-upload-container">
      <h1>Document Upload</h1>
      <p>Select a file to begin.</p>
      
      {error && <div className="error-alert">{error}</div>}
      
      <input 
        type="file" 
        onChange={handleFileChange}
        disabled={isLoading}
        accept=".pdf,.doc,.docx,.txt,.pptx"
        aria-label="Select file to upload"
      />
      
      {selectedFile && (
        <p className="selected-file">
          Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
        </p>
      )}
      
      <div className="button-group">
        <button 
          onClick={handleUpload} 
          disabled={!selectedFile || isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
        <button 
          onClick={handleCancel}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default UploadForm;





