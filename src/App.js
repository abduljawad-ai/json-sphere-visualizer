import React from 'react';
import FileUploader from './FileUploader';
import SphereViewer from './SphereViewer';

const App = () => {
    return (
        <div>
            <h1>File Uploader and Sphere Viewer Integration</h1>
            <FileUploader />
            <SphereViewer />
        </div>
    );
};

export default App;