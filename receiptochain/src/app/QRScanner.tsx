'use client';

import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface QRScannerProps {
  onScan: (data: { text: string }) => void;
  onError?: (error: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError = () => {} }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

useEffect(() => {
  codeReaderRef.current = new BrowserQRCodeReader();

  const startScanning = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setError('Camera not supported in this browser.');
        return;
      }

      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      console.log('Video input devices:', devices);

      if (!devices.length) {
        setError('No camera found on this device.');
        return;
      }

      const selectedDeviceId = devices[0].deviceId;

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
            if (err && err.name !== 'NotFoundException') {
              setError('Scanning error: ' + err.message);
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
