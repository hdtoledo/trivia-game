import { create } from "zustand";
import { devtools } from "zustand/middleware";

const decodeHtmlEntities = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

type TriviaState = {
  gameStarted: boolean;
  currentQuestionIndex: number;
  questions: {
    question: string;
    correctAnswer: string;
    options: string[];
    category: string;
    difficulty: string;
  }[];
  burnedQuestions: number;
  history: {
    question: string;
    correctAnswer: string;
    options: string[];
    category: string;
    difficulty: string;
    selectedAnswer: string | null;
    revealed: boolean;
  }[];
  startGame: () => Promise<void>;
  getNewQuestions: () => Promise<void>;
  incrementBurned: () => void;
  saveCurrentQuestion: (selectedAnswer: string | null, revealed: boolean) => void;
  nextQuestion: () => void;
  loadPreviousQuestion: (index: number) => void;
};

export const useTriviaStore = create<TriviaState>()(
  devtools((set, get) => ({
    gameStarted: false,
    currentQuestionIndex: 0,
    questions: [],
    burnedQuestions: 0,
    history: [],

    startGame: async () => {
      await get().getNewQuestions();
      set({ gameStarted: true, currentQuestionIndex: 0 }, false, "startGame");
    },

    getNewQuestions: async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
        const result = await response.json();

        if (!result.results || result.results.length === 0) {
          console.error("No trivia questions available.");
          return;
        }

        const formattedQuestions = result.results.map((q: any) => ({
          question: decodeHtmlEntities(q.question),
          correctAnswer: decodeHtmlEntities(q.correct_answer),
          options: [...q.incorrect_answers.map((ans: string) => decodeHtmlEntities(ans)), decodeHtmlEntities(q.correct_answer)].sort(() => Math.random() - 0.5),
          category: decodeHtmlEntities(q.category),
          difficulty: q.difficulty,
        }));

        set({ questions: formattedQuestions, currentQuestionIndex: 0 }, false, "getNewQuestions");
      } catch (error) {
        console.error("Error fetching trivia questions:", error);
      }
    },

    incrementBurned: () =>
      set((state) => ({ burnedQuestions: state.burnedQuestions + 1 }), false, "incrementBurned"),

    saveCurrentQuestion: (selectedAnswer, revealed) =>
      set((state) => {
        const currentIndex = state.currentQuestionIndex;
        const currentQuestion = state.questions[currentIndex];

        return {
          history: [
            ...state.history,
            {
              ...currentQuestion,
              selectedAnswer,
              revealed,
            },
          ],
        };
      }, false, "saveCurrentQuestion"),

    nextQuestion: () =>
      set((state) => {
        if (state.currentQuestionIndex < state.questions.length - 1) {
          return { currentQuestionIndex: state.currentQuestionIndex + 1 };
        }
        return {};
      }, false, "nextQuestion"),

    loadPreviousQuestion: (index) => {
      if (index >= 0 && index < get().history.length) {
        set({ currentQuestionIndex: index }, false, "loadPreviousQuestion");
      }
    },
  }))
);