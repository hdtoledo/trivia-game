import React, { useState, useEffect } from "react";
import { useTriviaStore } from "../store/useTriviaStore";
import { useQuery } from "@tanstack/react-query";

const TriviaScreen: React.FC = () => {
  const {
    questions,
    currentQuestionIndex,
    nextQuestion,
    incrementBurned,
    burnedQuestions,
    history,
    saveCurrentQuestion,
    loadPreviousQuestion,
    getNewQuestions,
  } = useTriviaStore();

  // Extraer la pregunta actual
  const currentQuestion = questions[currentQuestionIndex];

  // Estados locales
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  // React Query para obtener preguntas al inicio si es necesario
  const { refetch } = useQuery({
    queryKey: ["trivia"],
    queryFn: async () => {
      await getNewQuestions();
    },
    enabled: false,
  });

  useEffect(() => {
    if (!questions.length) {
      refetch();
    }
  }, [questions, refetch]);

  const handleNewQuestion = () => {
    // Guardar en el historial si la pregunta no ha sido guardada aún
    if (!history.find((q) => q.question === currentQuestion?.question)) {
      saveCurrentQuestion(selectedAnswer, revealed);
    }
    
    nextQuestion();
    setSelectedAnswer(null);
    setRevealed(false);
  };

  const viewPreviousQuestion = () => {
    if (history.length > 0 && currentQuestionIndex > 0) {
      loadPreviousQuestion(currentQuestionIndex - 1);
      setSelectedAnswer(history[currentQuestionIndex - 1].selectedAnswer);
      setRevealed(history[currentQuestionIndex - 1].revealed);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 px-4 bg-gradient-to-br from-gray-950 to-black text-white">
      <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-md md:max-w-2xl border border-purple-500 flex flex-col">
        
        {/* Categoría y Dificultad */}
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-bold mb-2 text-purple-400">🎯 {currentQuestion?.category}</h2>
          <p className="text-sm md:text-lg text-gray-400">🔥 Difficulty: <span className="font-semibold">{currentQuestion?.difficulty}</span></p>
        </div>

        {/* Pregunta */}
        <div className="flex-grow flex items-center justify-center px-4 py-6 md:py-10">
          <p className="text-lg md:text-2xl font-semibold text-white text-center break-words leading-normal md:leading-relaxed">
            {currentQuestion?.question}
          </p>
        </div>

        {/* Opciones de respuesta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              className={`px-5 py-3 md:py-4 rounded-lg text-white font-semibold text-sm md:text-lg transition-all duration-300 border border-purple-500 shadow-md
                ${
                  revealed
                    ? option === currentQuestion.correctAnswer
                      ? "bg-green-500"
                      : option === selectedAnswer
                      ? "bg-red-500"
                      : "bg-gray-800"
                    : selectedAnswer === option
                    ? "bg-purple-400"
                    : "bg-purple-700 hover:bg-purple-800"
                }`}
              onClick={() => !revealed && setSelectedAnswer(option)}
              disabled={revealed || selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>

        {revealed && (
          <p className="text-green-400 text-center text-sm md:text-lg font-bold mt-2 md:mt-4 animate-pulse">
            ✅ Correct Answer: {currentQuestion?.correctAnswer}
          </p>
        )}

        {/* Botones */}
        <div className="flex flex-col gap-4 mt-6">
          <button className="px-5 py-3 bg-green-500 hover:bg-green-600" onClick={() => { setRevealed(true); incrementBurned(); }} disabled={revealed}>
            🔍 Reveal Answer
          </button>

          <button className="px-5 py-3 bg-blue-500 hover:bg-blue-600" onClick={viewPreviousQuestion} disabled={history.length === 0 || currentQuestionIndex === 0}>
            ⬅️ View Previous Question
          </button>

          <button className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600" onClick={handleNewQuestion} disabled={!revealed}>
            🔄 Next Question
          </button>
        </div>

        <p className="mt-6 text-gray-400">🔥 Burned Questions: {burnedQuestions}</p>
      </div>
    </div>
  );
};

export default TriviaScreen;