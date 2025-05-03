import React, { useRef, useEffect } from 'react';

function CameraComponent({ onScan, onError }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Access the camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        onError("Error accessing camera: " + err.message);
      });
  }, [onError]);

  return (
    <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
  );
}

export default CameraComponent;
