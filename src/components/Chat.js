import React, { useState } from 'react';
import '../styles/Chat.css'; 

const Chat = ({ userInfo }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Historial de preguntas y respuestas
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (question.trim() === '') {
      setError('Por favor, escribe una pregunta.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Añadir la pregunta al historial
    const newChatHistory = [...chatHistory, { type: 'question', text: question }];

    try {
      // Llamar a la API para obtener la respuesta
      const response = await fetchAIResponse(question, userInfo);

      // Añadir la respuesta al historial
      setChatHistory([...newChatHistory, { type: 'answer', text: response }]);
    } catch (error) {
      setError('Error al obtener respuesta de la IA.');
    } finally {
      setIsSubmitting(false);
      setQuestion(''); // Limpiar el input de la pregunta
    }
  };

  const fetchAIResponse = async (question, userInfo) => {
    // Aquí va la lógica de llamada a tu backend o API
    const prompt = `El siguiente usuario ha sido detectado: ${userInfo.name} ${userInfo.lastname}. Información adicional: ${userInfo.description}. Pregunta: ${question}`;
    const response = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userInfo })
    });
    const data = await response.json();
    return data.answer; // Ajustar según el formato de tu respuesta de la API
  };  

  return (
    <div className="chat-container">
      <h2>Chat sobre {userInfo.name} {userInfo.lastname}</h2>

      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}`}>
            {message.type === 'question' ? <strong>Pregunta:</strong> : <strong>Respuesta:</strong>} {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          rows="4"
          cols="50"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Chat;
