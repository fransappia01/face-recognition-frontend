import React, { useState } from 'react';
import '../styles/QuestionInput.css'; 
import TextGenerate from './TextGenerate';

const QuestionInput = ({ userInfo }) => {
  const [question, setQuestion] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para controlar el envío
  const [error, setError] = useState(''); // Manejo de errores

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (question.trim() === '') {
      setError('Por favor, escribe una pregunta.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    setShowAnswer(true);
  };

  return (
    <div className="question-input-container">
      <h2>Haz una pregunta sobre {userInfo.name} {userInfo.lastname}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          rows="4"
          cols="50"
        />
        <button type="submit" disabled={isSubmitting}> {/* Deshabilita mientras se envía */}
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {/* Mostrar errores si los hay */}
      {error && <p className="error-message">{error}</p>}

      {/* Solo muestra la respuesta después de enviar */}
      {showAnswer && !isSubmitting && <TextGenerate userInfo={userInfo} question={question} />}
    </div>
  );
};

export default QuestionInput;
