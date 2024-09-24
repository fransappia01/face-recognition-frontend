import * as faceapi from 'face-api.js';
import React, { useEffect } from 'react';
import '../styles/FaceRecognition.css'

const FaceRecognition = () => {
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };

    loadModels();
  }, []);

  const handleImage = async (image) => {
    const detections = await faceapi.detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();
    console.log(detections); // Compara los descriptors con los guardados
  };

  return (
    <div className='face-recognition-container'>
      <input type="file" onChange={(e) => handleImage(e.target.files[0])} />
    </div>
  );
};

export default FaceRecognition;
