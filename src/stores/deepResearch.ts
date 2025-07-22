import { create } from "zustand";

interface DeepResearchState {
  topic: string;
  questions: string[];
  currentQuestion: number;
  answers: string[];
  questionsCompleted: boolean;
  isFetchingQuestions: boolean;
}

interface DeepResearchActions {
  setTopic: (topic: string) => void;
  setQuestions: (questions: string[]) => void;
  setCurrentQuestion: (currentQuestion: number) => void;
  setAnswers: (answers: string[]) => void;
  setQuestionsCompleted: (completed: boolean) => void;
  setIsFetchingQuestions: (isFetching: boolean) => void;
}

export const useDeepResearchStore = create<
  DeepResearchState & DeepResearchActions
>((set) => ({
  topic: "",
  questions: [],
  // questions: [
  //   "What is the specific angle or aspect you're interested in?",
  //   "Who is the intended audience for this research?",
  //   "What level of depth are you expecting? (Introductory, Intermediate, Deep Dive)",
  //   "Should the research focus on recent developments or include historical context?",
  // ],
  currentQuestion: 0,
  answers: [],
  questionsCompleted: false,
  isFetchingQuestions: false,
  setTopic: (topic: string) => set({ topic }),
  setQuestions: (questions: string[]) => set({ questions }),
  setCurrentQuestion: (currentQuestion: number) => set({ currentQuestion }),
  setAnswers: (answers: string[]) => set({ answers }),
  setQuestionsCompleted: (completed: boolean) =>
    set({ questionsCompleted: completed }),
  setIsFetchingQuestions: (isFetching: boolean) =>
    set({ isFetchingQuestions: isFetching }),
}));
