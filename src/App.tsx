import React from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import TriviaScreen from "./components/TriviaScreen";
import { useTriviaStore } from "./store/useTriviaStore";

const App: React.FC = () => {
  const { gameStarted, startGame } = useTriviaStore();

  return gameStarted ? <TriviaScreen /> : <WelcomeScreen startGame={startGame} />;
};

export default App;