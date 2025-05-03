'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import '../globals.css';

// Dynamically import QrScanner with SSR disabled
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

export default function QRScannerPage() {
  const [scannedData, setScannedData] = useState('No result yet');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [error, setError] = useState('');

  // Simulated payment check function
  const checkPaymentStatus = (id: string): string => {
    const fakeDatabase: { [key: string]: string } = {
      '12345': 'Paid',
      '67890': 'No records found',
    };
    return fakeDatabase[id] || 'No records found';
  };

  // Handle QR scan result
const handleScan = (data: any) => {
  if (data && data.text) {
    try {
      const scannedId = data.text;

      // Check if the scanned data is a valid JSON string
      let parsedData;
      try {
        parsedData = JSON.parse(scannedId); // Attempt to parse as JSON
      } catch (error) {
        parsedData = scannedId; // If it's not JSON, just use the raw text
      }

      setScannedData(parsedData);
      const status = checkPaymentStatus(parsedData);
      setPaymentStatus(status);
      setError('');
    } catch (err) {
      setError('Error processing the QR code. Please try again.');
      console.error('Error in handleScan:', err);
    }
  } else {
    setError('Invalid QR Code. Please try again.');
  }
};


  // Handle errors during QR scan
  const handleError = (err: any) => {
    setError('Error scanning the QR code. Please try again.');
    console.error(err);
  };

  return (
    <div className="min-h-screen bg-green-600 flex flex-col items-center justify-center p-6">
      {/* Display payment status in top right corner */}
      <div className="absolute top-4 right-4 p-4 bg-white text-green-600 font-semibold rounded-lg shadow-md">
        {paymentStatus && (
          <p className="text-sm">
            {paymentStatus === 'Paid'
              ? `ID ${scannedData} has already paid.`
              : `No records found for ID ${scannedData}.`}
          </p>
        )}
      </div>

      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg relative">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-4">Scan Your Receipt QR Code</h1>

        {/* QR Scanner Component */}
        <div className="relative mb-6">
        <QrScanner
              delay={300}
             style={{
               width: '100%',
               height: 'auto',
               borderRadius: '8px',
               border: '2px solid #4CAF50',
               }}
               onError={handleError}
               onScan={handleScan}

          />

        </div>

        {/* Display Scan Result */}
        {scannedData && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-green-600">Scanned Data:</h2>
            <p className="text-gray-800 mt-2">{scannedData}</p>
          </div>
        )}

        {/* Error Handling */}
        {error && (
          <div className="mt-4 text-red-500 font-semibold">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
