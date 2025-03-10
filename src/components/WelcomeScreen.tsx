import React from "react";

const WelcomeScreen: React.FC<{ startGame: () => void }> = ({ startGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white text-center p-6">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl max-w-lg w-full text-center border border-purple-500">
        <h1 className="text-4xl font-extrabold mb-6 text-purple-400 drop-shadow-lg">
          🎉 Welcome to the Trivia Challenge!
        </h1>
        <p className="text-lg mb-6 text-gray-300">
          Test your knowledge with fun and challenging questions!
        </p>
        <button
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition-all text-white text-xl font-semibold rounded-lg shadow-md w-full"
          onClick={startGame}
        >
          🚀 Start Game!
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;