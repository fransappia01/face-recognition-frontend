import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'react-camera-pro';

const PhoneCapture = () => {
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Solicita acceso a la cámara al montar el componente
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Aquí puedes manejar el flujo de la cámara si es necesario
      })
      .catch((error) => {
        console.error("Error accessing the camera:", error);
        alert("Please enable camera access in your browser settings.");
      });
  }, []);

  const handleTakePhoto = async () => {
    try {
      const photo = await cameraRef.current.takePhoto();
      setImage(photo);
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  return (
    <div>
      <Camera ref={cameraRef} />
      <button onClick={handleTakePhoto}>Take photo</button>
      {image && <img src={image} alt="Taken photo" />}
    </div>
  );
};

export default PhoneCapture;
