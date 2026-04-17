import React, { useState } from 'react';

const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];

        if (droppedFile && droppedFile.type === 'application/json') {
            setFile(droppedFile);
            setError('');
        } else {
            setError('Please upload a valid JSON file.');
            setFile(null);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div 
            onDrop={handleDrop} 
            onDragOver={handleDragOver} 
            style={{ border: '2px dashed #333', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
        >
            <p>Drag and drop a JSON file here, or click to upload</p>
            {file && <p>File: {file.name}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FileUploader;