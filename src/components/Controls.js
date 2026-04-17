import React from 'react';

const Controls = ({ fileName, onClear }) => {
    return (
        <div className="controls">
            <h1>{fileName ? `Uploaded File: ${fileName}` : 'No file uploaded'}</h1>
            <button onClick={onClear}>Clear</button>
        </div>
    );
};

export default Controls;