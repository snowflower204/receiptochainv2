'use client';

import { useState } from 'react';
import Sidebar from '@/app/sidebar';  // Adjust the import path based on your file structure

export default function Import() {
  const [file, setFile] = useState<File | null>(null);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload (you can replace this with your own upload logic)
  const handleFileUpload = () => {
    if (file) {
      // Here you would typically upload the file to a server or handle it
      console.log('File uploaded:', file.name);
      alert(`File ${file.name} uploaded successfully!`);
    } else {
      alert('Please select a file to upload.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Import</h1>
          <p className="text-lg text-gray-600 mb-4">Upload file here</p>

          {/* File upload input */}
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-gray-700 border border-gray-300 p-2 rounded-md"
            />
          </div>

          {/* Upload button */}
          <button
            onClick={handleFileUpload}
            className="w-full py-3 bg-green-700 text-white rounded-md font-semibold hover:bg-green-800 transition duration-300"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
