// src/components/TextGenerate.js
import React, { useEffect, useState } from 'react';
import '../styles/TextGenerate.css';

const TextGenerate = ({ userInfo, question }) => {
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const fetchAnswer = async () => {
      const apiKey = 'AIzaSyDpnLxxlCgcaltHSI1nPNi9IfF1Qg2806s';
      const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
      const prompt = `Información de la persona: ${userInfo}. Responde a la siguiente pregunta: ${question}`;

      try {
        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setAnswer(data.candidates[0].content.parts[0].text);
        } else {
          console.error('Error en la consulta:', data.error.message);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    if (question) {
      fetchAnswer();
    }
  }, [question, userInfo]);

  return (
    <div className="text-generate-container">
      <h3>Respuesta de la IA:</h3>
      <p>{answer}</p>
    </div>
  );
};

export default TextGenerate;
