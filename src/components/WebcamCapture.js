import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import '../styles/WebcamCapture.css';
import { CircularProgress, Button, Typography, Box, TextField } from '@mui/material'; // Importando componentes desde MUI

const WebcamCapture = ({ onUserInfoUpdate }) => {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]); // Para registrar los pasos
  const [faceEmbedding, setFaceEmbedding] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const videoConstraints = {
    width: 900,
    height: 520,
    facingMode: 'user'
  };

  const capture = async () => {
    setMessage('');
    setFaceEmbedding(null);
    setLog([]);
    setLoading(true); // Activa el spinner
    setLog(prev => [...prev, 'Cargando modelos...']); 
    console.log('Foto tomada');
    const imageSrc = webcamRef.current.getScreenshot();

    // Convierte la imagen Base64 en Blob
    const blob = await fetch(imageSrc).then(res => res.blob());
    const formData = new FormData();
    formData.append('image', blob, 'captura.jpg');
    
    setLog(prev => [...prev, 'Modelos cargados', 'Buscando rostros...']);

    try {
      const response = await fetch('http://localhost:5000/api/recognize', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      setLog(prev => [...prev, 'Procesando resultados...']);
      console.log('Resultado del backend:', result);

      if (result.userInfo) {
        setFaceEmbedding(result.faceEmbedding);
        setUserInfo(result.userInfo);
        onUserInfoUpdate(result.userInfo); 
        setMessage(`Usuario detectado: ${result.userInfo.name} ${result.userInfo.lastname}`);
        
        // Enviar información del usuario a la IA
        await sendToAI(result.userInfo);
      } else {
        setMessage(result.message || 'Error en el reconocimiento o comparación facial');
      }
      setLog(prev => [...prev, 'Proceso finalizado']);
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      setMessage('Error en el reconocimiento o comparación facial');
      setLog(prev => [...prev, 'Error en el procesamiento']);
    } finally {
      setLoading(false); // Desactiva el spinner cuando termina
    }
  };

  const sendToAI = async (userInfo) => {
    const apiKey = 'AIzaSyDpnLxxlCgcaltHSI1nPNi9IfF1Qg2806s';
    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    // Construir el contexto inicial para la IA
    const context = `El siguiente usuario ha sido detectado: ${userInfo.name} ${userInfo.lastname}. 
    Información adicional: ${userInfo.description}. 
    Ahora puedes responder cualquier pregunta sobre este usuario.`;
  
    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: context
                }
              ]
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText} - ${errorData.error.message}`);
      }
  
      const result = await response.json();
      console.log(result);
      setAnswer(result.candidates[0]?.content?.parts[0]?.text || 'No se obtuvo respuesta');
    } catch (error) {
      console.error('Error al enviar información a la IA:', error);
      setAnswer('Error al obtener respuesta de la IA');
    }
  };  

  return (
    <Box className='webcam-container' display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{
          transform: 'scaleX(-1)', // No reflejar horizontalmente
          borderRadius: '10px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={capture} 
        disabled={loading} 
        sx={{ mt: 3, width: 200 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Capturar Foto'}
      </Button>
      <Box className="log-container" mt={2}>
        {log.map((step, index) => (
          <Typography key={index} variant="body2" color="textSecondary">
            {step}
          </Typography>
        ))}
      </Box>
      {message && (
        <Box className="message-container" mt={2} p={2} bgcolor="#f0f0f0" borderRadius={1} textAlign="center" boxShadow={3}>
          <Typography variant="h6">Resultado:</Typography>
          <Typography variant="body1">{message}</Typography>
        </Box>
      )}
      
    </Box>
  );
};

export default WebcamCapture;
