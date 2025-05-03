'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

export default function QRScannerPage() {
  const [scannedData, setScannedData] = useState<string | object>('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserQRCodeReader();

    const startScanning = async () => {
      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();
        const selectedDeviceId = devices[0]?.deviceId;

        if (!selectedDeviceId) {
          setError('No camera found');
          return;
        }

        if (videoRef.current && codeReaderRef.current) {
          codeReaderRef.current.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                setScannedData(result.getText());
                checkPaymentStatus(result.getText());
                setError('');
              }
              if (err && !(err.name === 'NotFoundException')) {
                setError('Error scanning the QR code: ' + err.message);
              }
            }
          );
        }
      } catch (err: any) {
        setError('Error initializing scanner: ' + err.message);
      }
    };

    startScanning();

    return () => {
      if (codeReaderRef.current) {
        (codeReaderRef.current as any).reset();
        codeReaderRef.current = null;
      }
    };
  }, []);

  const checkPaymentStatus = async (scannedId: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scannedId }),
      });

      const data = await res.json();
      if (res.ok && data.scanned) {
        setPaymentStatus(data.scanned.status);
        setError('');
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      setError('Could not check payment status. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-green-600 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Scan Your Receipt QR Code
        </h1>

        {/* Live camera QR scanner */}
        <div className="relative w-full h-auto overflow-hidden rounded-xl border-2 border-green-600 mb-6">
          <video ref={videoRef} className="w-full h-auto rounded-xl" />
        </div>

        {scannedData && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-green-700">Scanned Data:</h2>
            <pre className="bg-gray-100 text-gray-800 p-3 rounded mt-2 whitespace-pre-wrap">
              {typeof scannedData === 'object'
                ? JSON.stringify(scannedData, null, 2)
                : scannedData}
            </pre>
          </div>
        )}

        {paymentStatus && (
          <div className="mt-4 text-green-700 font-semibold">
            <p>Payment Status: {paymentStatus}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-600 font-semibold">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
