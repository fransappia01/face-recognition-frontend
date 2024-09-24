import React, { useState } from 'react';
import WebcamCapture from './components/WebcamCapture';
import PhoneCapture from './components/PhoneCapture';
import { CssBaseline, Container } from '@mui/material';
import { isMobile, isIOS } from 'react-device-detect';
import './App.css';
import Chat from './components/Chat'; // Ahora usamos Chat en lugar de QuestionInput

function App() {
  const [userInfo, setUserInfo] = useState(null); // Aquí guardarás la información del usuario detectado
  const isIphone = isMobile && isIOS;

  // Función para actualizar la información del usuario
  const handleUserInfoUpdate = (info) => {
    const { name, lastname, description } = info;
    setUserInfo({
      name,
      lastname,
      description
    });
  };

  return (
    <div className="App">
      <h1>Reconocimiento Facial</h1>
      <Container>
        <CssBaseline />
        {isIphone ? <PhoneCapture onUserInfoUpdate={handleUserInfoUpdate} /> : <WebcamCapture onUserInfoUpdate={handleUserInfoUpdate} />}
        {userInfo && <Chat userInfo={userInfo} />}
      </Container>
    </div>
  );
}

export default App;
